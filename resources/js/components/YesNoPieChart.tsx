'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type ChartItem = {
    browser: string;
    visitors: number;
    fill: string;
};

const COLORS = {
    yes: '#fbbf24',
    no: '#d97706',
    unsure: '#92400e',
    unknown: '#451a03',
};

export default function RelatedChart() {
    const [data, setData] = useState<ChartItem[]>([]);

    useEffect(() => {
        axios.get('/related').then((res) => {
            const incoming: ChartItem[] = res.data.map((item: any) => ({
                browser: item.browser,
                visitors: item.visitors,
                fill: COLORS[item.browser?.toLowerCase() as keyof typeof COLORS] ?? COLORS.unknown,
            }));
            setData(incoming);
        });
    }, []);

    const renderLegend = (props: any) => {
        const { payload } = props;
        return (
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 capitalize">
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} className="flex items-center gap-1 text-sm">
                        <span className="inline-block h-2 w-2 " style={{ backgroundColor: entry.color }} />
                        {entry.value}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Card className="h-full w-full rounded-2xl border shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Course Relevance</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Are alumni working in fields related to their course?</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="visitors"
                            nameKey="browser"
                            cx="50%"
                            cy="50%"
                            className="stroke-none capitalize"
                            outerRadius={100}
                            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(1)}%)`}
                            isAnimationActive={true}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend content={renderLegend} verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
