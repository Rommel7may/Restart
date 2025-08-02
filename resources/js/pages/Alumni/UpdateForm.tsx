import * as React from 'react'
import { usePage, useForm } from '@inertiajs/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function UpdateForm() {
  const { props } = usePage()
  const alumni = props.alumni as Record<string, any>

  const { data, setData, put, processing } = useForm({
    student_number: alumni.student_number || '',
    email: alumni.email || '',
    program: alumni.program || '',
    last_name: alumni.last_name || '',
    given_name: alumni.given_name || '',
    middle_initial: alumni.middle_initial || '',
    present_address: alumni.present_address || '',
    active_email: alumni.active_email || '',
    contact_number: alumni.contact_number || '',
    graduation_year: alumni.graduation_year || '',
    employment_status: alumni.employment_status || '',
    company_name: alumni.company_name || '',
    related_to_course: alumni.related_to_course || '',
    further_studies: alumni.further_studies || '',
    sector: alumni.sector || '',
    work_location: alumni.work_location || '',
    employer_classification: alumni.employer_classification || '',
    consent: alumni.consent ?? false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    put(`/alumni-update-form/${alumni.student_number}`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('✅ Successfully updated your alumni record!')
        setTimeout(() => window.close(), 1000)
      },
      onError: () => {
        toast.error('❌ Failed to update. Please check the fields.')
      },
    })
  }

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from(
    { length: currentYear - 2022 + 1 },
    (_, i) => `${currentYear - i}`
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Your Alumni Information</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          value={data.student_number}
          readOnly
          className="bg-gray-100 font-semibold text-black"
          placeholder="Student Number"
        />
        <Input
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          placeholder="Student Email"
        />

        <Select
          value={data.program}
          onValueChange={(value) => setData('program', value)}
        >
          <SelectTrigger><SelectValue placeholder="Program Taken" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="BSIT">BS Information Technology</SelectItem>
            <SelectItem value="BSBA">BS Business Administration</SelectItem>
            <SelectItem value="BSE">BS Entrepreneurship</SelectItem>
            <SelectItem value="BEED">Bachelor of Elementary Education</SelectItem>
            <SelectItem value="BSTM">BS Tourism Management</SelectItem>
            <SelectItem value="PSYC">BS Psychology</SelectItem>
            <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
          </SelectContent>
        </Select>

        <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} placeholder="Last Name" />
        <Input value={data.given_name} onChange={(e) => setData('given_name', e.target.value)} placeholder="Given Name" />
        <Input value={data.middle_initial} onChange={(e) => setData('middle_initial', e.target.value)} placeholder="Middle Initial" />
        <Input value={data.present_address} onChange={(e) => setData('present_address', e.target.value)} placeholder="Present Address" />
        <Input type="email" value={data.active_email} onChange={(e) => setData('active_email', e.target.value)} placeholder="Active Email" />
        <Input value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} placeholder="Contact Number" />

        <Select
          value={data.graduation_year}
          onValueChange={(value) => setData('graduation_year', value)}
        >
          <SelectTrigger><SelectValue placeholder="Graduation Year" /></SelectTrigger>
          <SelectContent>
            {graduationYears.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={data.employment_status}
          onValueChange={(value) => {
            setData('employment_status', value)
            if (value !== 'employed') {
              setData('company_name', '')
              setData('related_to_course', '')
            }
          }}
        >
          <SelectTrigger><SelectValue placeholder="Employment Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="employed">Employed</SelectItem>
            <SelectItem value="under-employed">Under Employed</SelectItem>
            <SelectItem value="unemployed">Unemployed</SelectItem>
            <SelectItem value="self-employed">Self Employed</SelectItem>
            <SelectItem value="currently-looking">Currently Looking / Applying</SelectItem>
          </SelectContent>
        </Select>

        {data.employment_status === 'employed' && (
          <>
            <Input
              value={data.company_name}
              onChange={(e) => setData('company_name', e.target.value)}
              placeholder="Company Name"
            />

            <Select
              value={data.related_to_course}
              onValueChange={(value) => setData('related_to_course', value)}
            >
              <SelectTrigger><SelectValue placeholder="Is your job related to your course?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unsure">Not Sure</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <Select
          value={data.further_studies}
          onValueChange={(value) => setData('further_studies', value)}
        >
          <SelectTrigger><SelectValue placeholder="Further Studies (optional)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="ma">MA</SelectItem>
            <SelectItem value="mba">MBA</SelectItem>
            <SelectItem value="mit">MIT</SelectItem>
            <SelectItem value="mce">MCE</SelectItem>
            <SelectItem value="phd">PhD</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={data.sector}
          onValueChange={(value) => setData('sector', value)}
        >
          <SelectTrigger><SelectValue placeholder="Work Sector (optional)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="government">Government</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="self-employed">Self Employed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={data.work_location}
          onValueChange={(value) => setData('work_location', value)}
        >
          <SelectTrigger><SelectValue placeholder="Work Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local</SelectItem>
            <SelectItem value="abroad">Abroad</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={data.employer_classification}
          onValueChange={(value) => setData('employer_classification', value)}
        >
          <SelectTrigger><SelectValue placeholder="Employer Classification" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="local">Local Company in the Philippines</SelectItem>
            <SelectItem value="foreign-ph">Foreign Company in the Philippines</SelectItem>
            <SelectItem value="foreign-abroad">Foreign Company Abroad</SelectItem>
            <SelectItem value="self-employed">I Am Self Employed</SelectItem>
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
          Update Info
        </Button>
      </form>
    </div>
  )
}
