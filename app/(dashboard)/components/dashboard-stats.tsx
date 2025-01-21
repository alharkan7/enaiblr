"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardStats = {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
};

type RegistrationData = {
  date: string;
  'Pro Users': number;
  'Free Users': number;
};

type ActivityData = {
  date: string;
  Chats: number;
  Messages: number;
  Documents: number;
  Folders: number;
};

type Activities = {
  proUsers: ActivityData[];
  freeUsers: ActivityData[];
};

const CustomXAxisTick = ({ x, y, payload }: any) => {
  const date = parseISO(payload.value);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#888888"
        fontSize={12}
      >
        {format(date, 'MMM dd')}
      </text>
      <text
        x={0}
        y={20}
        dy={16}
        textAnchor="middle"
        fill="#888888"
        fontSize={12}
      >
        {format(date, 'EEE')}
      </text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {format(parseISO(label), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {payload.map((item: any) => (
              <div key={item.name} className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  {item.name}
                </span>
                <span className="font-bold text-muted-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomActivityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {format(parseISO(label), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {payload.map((item: any) => (
              <div key={item.name} className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  {item.name}
                </span>
                <span className="font-bold text-muted-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex items-center justify-center gap-6 text-sm">
      {payload.map((entry: any) => {
        return (
          <div key={entry.value} className="flex items-center gap-2">
            <div 
              className="h-4 w-4 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-72" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-72" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [activities, setActivities] = useState<Activities | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, registrationsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/dashboard/registrations'),
          fetch('/api/dashboard/activities')
        ]);
        
        if (!statsResponse.ok || !registrationsResponse.ok || !activitiesResponse.ok) 
          throw new Error('Failed to fetch data');
        
        const statsData = await statsResponse.json();
        const registrationsData = await registrationsResponse.json();
        const activitiesData = await activitiesResponse.json();
        
        setStats(statsData);
        setRegistrations(registrationsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!stats || !activities) {
    return <DashboardSkeleton />;
  }

  const chartColors = {
    Chats: '#8884d8',
    Messages: '#82ca9d',
    Documents: '#ffc658',
    Folders: '#ff8042'
  };

  const getMaxValue = (data: any[]) => {
    return Math.max(...data.map(item => 
      Math.max(
        item.Chats || 0,
        item.Messages || 0,
        item.Documents || 0,
        item.Folders || 0
      )
    ));
  };

  const calculateYAxisDomain = (data: any[]) => {
    const maxValue = getMaxValue(data);
    // Add 20% padding to the max value
    return [0, Math.ceil(maxValue * 1.2)];
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pro Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freeUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            User Registrations <span className="font-normal text-muted-foreground">(Last 30 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrations}>
                <XAxis 
                  dataKey="date" 
                  stroke="#888888"
                  height={65}
                  tickLine={false}
                  axisLine={false}
                  tick={<CustomXAxisTick />}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Pro Users"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Free Users"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Pro Users Activities <span className="font-normal text-muted-foreground">(Last 30 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activities.proUsers}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  height={65}
                  tickLine={false}
                  axisLine={false}
                  tick={<CustomXAxisTick />}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={calculateYAxisDomain(activities.proUsers)}
                />
                <Tooltip content={<CustomActivityTooltip />} />
                <Legend content={<CustomLegend />} />
                <Bar 
                  dataKey="Chats" 
                  fill={chartColors.Chats}
                  radius={[10, 10, 0, 0]}
                />
                <Bar 
                  dataKey="Messages" 
                  fill={chartColors.Messages}
                  radius={[10, 10, 0, 0]}
                />
                <Bar 
                  dataKey="Documents" 
                  fill={chartColors.Documents}
                  radius={[10, 10, 0, 0]}
                />
                <Bar 
                  dataKey="Folders" 
                  fill={chartColors.Folders}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Free Users Activities <span className="font-normal text-muted-foreground">(Last 30 Days)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activities.freeUsers}>
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  height={65}
                  tickLine={false}
                  axisLine={false}
                  tick={<CustomXAxisTick />}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={calculateYAxisDomain(activities.freeUsers)}
                />
                <Tooltip content={<CustomActivityTooltip />} />
                <Legend content={<CustomLegend />} />
                <Bar 
                  dataKey="Chats" 
                  fill={chartColors.Chats}
                  radius={[10, 10, 0, 0]}
                />
                <Bar 
                  dataKey="Messages" 
                  fill={chartColors.Messages}
                  radius={[10, 10, 0, 0]}
                />
                <Bar 
                  dataKey="Documents" 
                  fill={chartColors.Documents}
                  radius={[10, 10, 0, 0]}
                />
                <Bar 
                  dataKey="Folders" 
                  fill={chartColors.Folders}
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
