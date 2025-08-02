'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, Fragment } from 'react';
import { cn } from '@/lib/utils';

interface ComparisonField {
  field: string;
  mock: any;
  db: any;
  isMatched: boolean;
}

interface ChannelComparison {
  channelName: string;
  isFullySync: boolean;
  syncPercentage: number;
  differences: ComparisonField[];
  totalFields: number;
}

interface DataComparisonTableProps {
  comparisons: ChannelComparison[];
}

export function DataComparisonTable({ comparisons }: DataComparisonTableProps) {
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set());

  const toggleChannel = (channelName: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelName)) {
      newExpanded.delete(channelName);
    } else {
      newExpanded.add(channelName);
    }
    setExpandedChannels(newExpanded);
  };

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return value.toString();
    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📋 Detailed Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead>Differences</TableHead>
              <TableHead className="text-right">Sync %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((comparison) => {
              const isExpanded = expandedChannels.has(comparison.channelName);
              const hasDifferences = comparison.differences.length > 0;
              
              return (
                <Fragment key={comparison.channelName}>
                  <TableRow
                    className={cn(
                      'cursor-pointer hover:bg-muted/50',
                      hasDifferences && 'border-b-0'
                    )}
                    onClick={() => hasDifferences && toggleChannel(comparison.channelName)}
                  >
                    <TableCell>
                      {hasDifferences && (
                        isExpanded ? 
                          <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{comparison.channelName}</TableCell>
                    <TableCell>
                      {comparison.isFullySync ? (
                        <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
                          <CheckCircle2 className="h-3 w-3" />
                          Fully Synced
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-200">
                          <XCircle className="h-3 w-3" />
                          {comparison.differences.length} Differences
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {comparison.totalFields - comparison.differences.length} / {comparison.totalFields} fields matched
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        'font-medium',
                        comparison.syncPercentage === 100 && 'text-green-600',
                        comparison.syncPercentage >= 80 && comparison.syncPercentage < 100 && 'text-yellow-600',
                        comparison.syncPercentage < 80 && 'text-red-600'
                      )}>
                        {comparison.syncPercentage}%
                      </span>
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && hasDifferences && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="bg-muted/30 p-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Field</TableHead>
                                <TableHead>Mock Value</TableHead>
                                <TableHead>Database Value</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {comparison.differences.map((diff, idx) => (
                                <TableRow key={`${comparison.channelName}-${diff.field}-${idx}`}>
                                  <TableCell className="font-mono text-sm">{diff.field}</TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {formatValue(diff.mock)}
                                  </TableCell>
                                  <TableCell className="font-mono text-sm">
                                    {formatValue(diff.db)}
                                  </TableCell>
                                  <TableCell>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}