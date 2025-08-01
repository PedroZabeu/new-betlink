import { Tip } from '@/lib/types/channel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ResultsTableProps {
  tips: Tip[];
}

export default function ResultsTable({ tips }: ResultsTableProps) {
  const getStatusBadge = (status: Tip['status']) => {
    switch (status) {
      case 'win':
        return <Badge className="bg-green-100 text-green-700">Green</Badge>;
      case 'loss':
        return <Badge variant="destructive">Red</Badge>;
      case 'void':
        return <Badge variant="secondary">Void</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
    }
  };
  
  const getReturnColor = (value: number) => {
    if (value > 0) return 'text-green-600 font-medium';
    if (value < 0) return 'text-red-600 font-medium';
    return 'text-muted-foreground';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Recentes</CardTitle>
        <CardDescription>
          Últimas 20 apostas enviadas no canal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Mercado</TableHead>
                <TableHead className="text-center">Odd</TableHead>
                <TableHead className="text-center">Stake</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead className="text-right">Retorno</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tips.map((tip) => (
                <TableRow key={tip.id}>
                  <TableCell className="text-sm">
                    {format(new Date(tip.date), 'dd/MM', { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{tip.event}</TableCell>
                  <TableCell>{tip.market}</TableCell>
                  <TableCell className="text-center">{tip.odd.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{tip.stake}u</TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(tip.status)}
                  </TableCell>
                  <TableCell className={`text-right ${getReturnColor(tip.return)}`}>
                    {tip.return > 0 ? '+' : ''}{tip.return.toFixed(2)}u
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Mostrando últimas 20 de {tips.length} apostas</span>
          <span>
            Para ver o histórico completo, assine o canal
          </span>
        </div>
      </CardContent>
    </Card>
  );
}