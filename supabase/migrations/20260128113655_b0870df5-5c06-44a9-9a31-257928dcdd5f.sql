-- Create enum for audit status
CREATE TYPE public.audit_status AS ENUM ('planning', 'in_progress', 'completed', 'on_hold');

-- Create enum for finding severity
CREATE TYPE public.finding_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');

-- Create enum for finding status
CREATE TYPE public.finding_status AS ENUM ('open', 'fixed', 'accepted_risk', 'false_positive');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audits table
CREATE TABLE public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    target TEXT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status audit_status NOT NULL DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create OWASP checklist items table (predefined items per audit)
CREATE TABLE public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE NOT NULL,
    owasp_category TEXT NOT NULL,
    owasp_code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    checked BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create findings table
CREATE TABLE public.findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES public.audits(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    checklist_item_id UUID REFERENCES public.checklist_items(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    severity finding_severity NOT NULL DEFAULT 'medium',
    status finding_status NOT NULL DEFAULT 'open',
    proof_of_concept TEXT,
    remediation TEXT,
    affected_url TEXT,
    cvss_score DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attachments table for screenshots/evidence
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finding_id UUID REFERENCES public.findings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for evidence files
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', false);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Helper function to check audit ownership
CREATE OR REPLACE FUNCTION public.is_owner_of_audit(audit_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.audits
        WHERE id = audit_uuid AND user_id = auth.uid()
    );
$$;

-- Helper function to check finding ownership
CREATE OR REPLACE FUNCTION public.is_owner_of_finding(finding_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.findings
        WHERE id = finding_uuid AND user_id = auth.uid()
    );
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Audits RLS policies
CREATE POLICY "Users can view their own audits"
ON public.audits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audits"
ON public.audits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audits"
ON public.audits FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audits"
ON public.audits FOR DELETE
USING (auth.uid() = user_id);

-- Checklist items RLS policies (based on audit ownership)
CREATE POLICY "Users can view checklist items of their audits"
ON public.checklist_items FOR SELECT
USING (public.is_owner_of_audit(audit_id));

CREATE POLICY "Users can create checklist items for their audits"
ON public.checklist_items FOR INSERT
WITH CHECK (public.is_owner_of_audit(audit_id));

CREATE POLICY "Users can update checklist items of their audits"
ON public.checklist_items FOR UPDATE
USING (public.is_owner_of_audit(audit_id));

CREATE POLICY "Users can delete checklist items of their audits"
ON public.checklist_items FOR DELETE
USING (public.is_owner_of_audit(audit_id));

-- Findings RLS policies
CREATE POLICY "Users can view their own findings"
ON public.findings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create findings for their audits"
ON public.findings FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_owner_of_audit(audit_id));

CREATE POLICY "Users can update their own findings"
ON public.findings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own findings"
ON public.findings FOR DELETE
USING (auth.uid() = user_id);

-- Attachments RLS policies
CREATE POLICY "Users can view their own attachments"
ON public.attachments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create attachments for their findings"
ON public.attachments FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.is_owner_of_finding(finding_id));

CREATE POLICY "Users can delete their own attachments"
ON public.attachments FOR DELETE
USING (auth.uid() = user_id);

-- Storage RLS policies for evidence bucket
CREATE POLICY "Users can view their own evidence files"
ON storage.objects FOR SELECT
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own evidence files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own evidence files"
ON storage.objects FOR DELETE
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_audits_updated_at
BEFORE UPDATE ON public.audits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at
BEFORE UPDATE ON public.checklist_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_findings_updated_at
BEFORE UPDATE ON public.findings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();