import { ChartPieLegend } from '@/components/employment-pie-chart';
import LocationPieChart from '@/components/work-location-chart';
import RelatedChart from '@/components/YesNoPieChart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Data Analytics',
    href: '/data',
  },
];

export default function Data() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Data" />
      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3">
        <div className="rounded-2xl">
          <ChartPieLegend />
        </div>
        <div className="rounded-2xl">
          <RelatedChart />
        </div>
        <div className="rounded-2xl">
          <LocationPieChart/>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-zinc-900 flex items-center justify-center text-lg font-semibold">
          chart 4
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-md dark:bg-zinc-900 flex items-center justify-center text-lg font-semibold">
          chart 5
        </div>
      </div>
    </AppLayout>
  );
}
