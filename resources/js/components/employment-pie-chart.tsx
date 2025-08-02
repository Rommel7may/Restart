'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

type ChartDataItem = {
    browser: string;
    visitors: number;
    fill?: string;
};

const chartConfig = {
    employed: { label: 'Employed', color: '#fda4af' },
    'under-employed': { label: 'Under-Employed', color: '#f43f5e' },
    unemployed: { label: 'Unemployed', color: '#e11d48' },
    'self-employed': { label: 'Self-Employed', color: '#be123c' },
    'currently-looking': { label: 'Currently looking', color: '#9f1239' },
} satisfies ChartConfig;

export function ChartPieLegend() {
    const [chartData, setChartData] = useState<ChartDataItem[]>([]);

    useEffect(() => {
        axios.get('/alumni-chart').then((res) => {
            const dataWithColors = res.data.map((item: ChartDataItem) => ({
                ...item,
                fill: chartConfig[item.browser as keyof typeof chartConfig]?.color || '#ccc',
            }));
            setChartData(dataWithColors);
        });
    }, []);

    const [showLabels, setShowLabels] = useState(false);

    return (
        <Card className="flex h-[450px] w-full flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Alumni Employment Pie</CardTitle>
                <CardDescription>Data from database</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-[300px] w-full capitalize">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="visitors"
                                    className="capitalize"
                                    nameKey="browser"
                                    isAnimationActive={true}
                                    onAnimationEnd={() => setShowLabels(true)} // ✅ Triggers label after animation
                                    label={
                                        showLabels
                                            ? ({ name, percent }) => (percent !== undefined ? `${name} ${(percent * 100).toFixed(1)}%` : '')
                                            : undefined
                                    }
                                />

                                <Tooltip />
                                <ChartLegend
                                    content={
                                        <ChartLegendContent
                                            nameKey="browser"
                                            payload={chartData.map((item) => ({
                                                name: item.browser,
                                                value: item.visitors,
                                                color: item.fill,
                                            }))}
                                        />
                                    }
                                    className="mt-4 grid grid-cols-3 gap-1"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    <p className="text-center text-muted-foreground">Loading chart data...</p>
                )}
            </CardContent>
        </Card>
    );
}
