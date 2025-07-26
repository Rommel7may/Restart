<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;

class ChartController extends Controller
{
    public function alumniPie()
    {
        $data = Alumni::selectRaw('employment_status, COUNT(*) as visitors')
            ->groupBy('employment_status')
            ->get()
            ->map(function ($item) {
                return [
                    'browser' => $item->employment_status ?? 'unknown',
                    'visitors' => $item->visitors,
                    'fill' => $this->getColor($item->employment_status),
                ];
            });

        return response()->json($data);
    }

    private function getColor($status)
{
    return match($status) {
        'employed' => 'var(--chart-1)',
        'unemployed' => 'var(--chart-2)',
        'self-employed' => 'var(--chart-3)',
        'under-employed' => 'var(--chart-4)', // ✅ dagdag ito
        default => 'var(--chart-5)',
    };
}

}
