<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alumni;

class YesNoController extends Controller
{
    public function YesNo()
    {
        $data = Alumni::selectRaw('related_to_course, COUNT(*) as visitors')
            ->groupBy('related_to_course')
            ->get()
            ->map(function ($item) {
                return [
                    'browser' => $item->related_to_course ?? 'unknown',
                    'visitors' => $item->visitors,
                    'fill' => $this->getColor($item->related_to_course),
                ];
            });

        return response()->json($data);
    }

    private function getColor($status)
{
    return match($status) {
        'yes' => 'var(--chart-1)',
        'no' => 'var(--chart-2)',
        'unsure' => 'var(--chart-3)',
        default => 'var(--chart-4)',
    };
}

}
