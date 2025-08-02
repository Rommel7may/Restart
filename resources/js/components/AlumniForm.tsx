import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import * as React from 'react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface AlumniFormProps {
  mode?: 'create' | 'edit';
  id?: number;
  student_number?: string;
  email?: string;
  program_id?: string | number | null;
  last_name?: string;
  given_name?: string;
  middle_initial?: string;
  present_address?: string;
  active_email?: string;
  contact_number?: string;
  graduation_year?: string;
  employment_status?: string;
  company_name?: string;
  further_studies?: string;
  sector?: string;
  work_location?: string;
  employer_classification?: string;
  related_to_course?: string;
  consent?: boolean;
  onSuccess?: (updated: any) => void;
}

export function AlumniForm({
  mode = 'create',
  id,
  student_number = '',
  email = '',
  program_id = null,
  last_name = '',
  given_name = '',
  middle_initial = '',
  present_address = '',
  active_email = '',
  contact_number = '',
  graduation_year = '',
  employment_status = '',
  company_name = '',
  further_studies = '',
  sector = '',
  work_location = '',
  employer_classification = '',
  related_to_course = '',
  consent = false,
  onSuccess,
}: AlumniFormProps) {
  const isEditing = mode === 'edit';
  const [programs, setPrograms] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    axios.get('/api/programs').then((res) => setPrograms(res.data));
  }, []);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    id,
    student_number,
    email,
    program_id: program_id ? String(program_id) : '',
    last_name,
    given_name,
    middle_initial,
    present_address,
    active_email,
    contact_number,
    graduation_year,
    employment_status,
    company_name,
    further_studies,
    sector,
    work_location,
    employer_classification,
    related_to_course,
    consent,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!isEditing) {
        const res = await axios.get('/check-active-email', {
          params: { email: data.active_email },
        });

        if (res.data.exists) {
          toast.error('❌ Active email already exists. Please use another email.');
          return;
        }
      }

      const endpoint = isEditing
        ? `/alumni-update-form/${data.student_number}`
        : `/alumni-form/${data.student_number}/submit`;

      const method = isEditing ? put : post;

      method(endpoint, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          toast.success(isEditing ? '✅ Record updated!' : '🎉 Form submitted successfully!');
          const updated = page.props.alumni || null;
          if (updated) onSuccess?.(updated);
          reset();
        },
        onError: (errors: Record<string, string>) => {
          const messages = Object.values(errors).filter(Boolean);
          toast.error(messages.length ? messages.join(', ') : '❌ Submission failed.');
        },
      });
    } catch (error) {
      toast.error('⚠️ Something went wrong while checking active email.');
    }
  };

  const yearOptions = Array.from(
    { length: new Date().getFullYear() - 2022 + 1 },
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      <h2 className="col-span-2 text-2xl font-bold">
        {isEditing ? 'Update Alumni Record' : 'Alumni Form'}
      </h2>

      <Input
        placeholder="Student Number"
        value={data.student_number}
        onChange={(e) => setData('student_number', e.target.value)}
        disabled={processing}
        className={errors.student_number ? 'border-red-500' : ''}
      />
      <Input placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />

      <Select
        value={data.program_id}
        onValueChange={(value) => setData('program_id', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Program taken" />
        </SelectTrigger>
        <SelectContent>
          {programs.map((prog) => (
            <SelectItem key={prog.id} value={String(prog.id)}>
              {prog.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input placeholder="Last Name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
      <Input placeholder="Given Name" value={data.given_name} onChange={(e) => setData('given_name', e.target.value)} />
      <Input placeholder="Middle Initial" value={data.middle_initial} onChange={(e) => setData('middle_initial', e.target.value)} />
      <Input placeholder="Present Address" value={data.present_address} onChange={(e) => setData('present_address', e.target.value)} />
      <Input type="email" placeholder="Active Email" value={data.active_email} onChange={(e) => setData('active_email', e.target.value)} />
      <Input placeholder="Contact Number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} />

      <Select value={data.graduation_year} onValueChange={(value) => setData('graduation_year', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Graduation Year" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={data.employment_status}
        onValueChange={(value) => {
          setData('employment_status', value);
          if (value !== 'employed') setData('company_name', '');
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Employment Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="employed">Employed</SelectItem>
          <SelectItem value="under-employed">Under Employed</SelectItem>
          <SelectItem value="unemployed">Unemployed</SelectItem>
          <SelectItem value="self-employed">Self Employed</SelectItem>
          <SelectItem value="currently-looking">Currently Looking / Applying</SelectItem>
        </SelectContent>
      </Select>

      {data.employment_status === 'employed' && (
        <Input
          placeholder="Company Name"
          value={data.company_name}
          onChange={(e) => setData('company_name', e.target.value)}
        />
      )}

      <Select value={data.further_studies} onValueChange={(value) => setData('further_studies', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Further Studies (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no">No</SelectItem>
          <SelectItem value="ma">MA</SelectItem>
          <SelectItem value="mba">MBA</SelectItem>
          <SelectItem value="mit">MIT</SelectItem>
          <SelectItem value="mce">MCE</SelectItem>
          <SelectItem value="phd">PhD</SelectItem>
        </SelectContent>
      </Select>

      <Select value={data.sector} onValueChange={(value) => setData('sector', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Which Sector Do You Work (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="government">Government</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="self-employed">Self Employed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={data.work_location} onValueChange={(value) => setData('work_location', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Where is Your Work Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local">Local</SelectItem>
          <SelectItem value="abroad">Abroad</SelectItem>
        </SelectContent>
      </Select>

      <Select value={data.employer_classification} onValueChange={(value) => setData('employer_classification', value)}>
        <SelectTrigger>
          <SelectValue placeholder="What's Your Employer's Classification" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="local">Local Company in the Philippines</SelectItem>
          <SelectItem value="foreign-ph">Foreign Company in the Philippines</SelectItem>
          <SelectItem value="foreign-abroad">Foreign Company Abroad</SelectItem>
          <SelectItem value="self-employed">I Am Self Employed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={data.related_to_course} onValueChange={(value) => setData('related_to_course', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Is your work related to your course?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
          <SelectItem value="unsure">Not Sure</SelectItem>
        </SelectContent>
      </Select>

      <div className="col-span-2 flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => setData('consent', e.target.checked)}
          required
        />
        <label className="text-sm">I consent to the processing of my data.</label>
      </div>

      <Button type="submit" disabled={processing} className="col-span-2">
        {isEditing ? 'Update' : 'Submit'}
      </Button>
    </form>
  );
}
