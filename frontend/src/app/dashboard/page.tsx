import Chart from "@/components/chart";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import View from "@/components/view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowBigUpDash,
  Percent,
  TagIcon,
  Ticket,
  Users,
} from "lucide-react";

export default function Dashboard() {
  return (
    <main className="sm:ml-14 p-4">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl select-none">
                Total de tickets
              </CardTitle>
              <Ticket className="w-6 h-6" />
            </div>

            <CardDescription>Total de tickets em 24h</CardDescription>

            <CardContent>
              <p className="text-base sm:text-lg font-bold">200</p>
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl select-none">
                Novos usuários
              </CardTitle>
              <Users className="w-6 h-6" />
            </div>

            <CardDescription>Novos usuários em 24h</CardDescription>

            <CardContent>
              <p className="text-base sm:text-lg font-bold">20</p>
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl select-none">
                Tickets hoje
              </CardTitle>
              <TagIcon className="w-6 h-6" />
            </div>

            <CardDescription>Total de tickets hoje</CardDescription>

            <CardContent>
              <p className="text-base sm:text-lg font-bold">5</p>
            </CardContent>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl select-none">
                Tickets resolvidos
              </CardTitle>
              <Percent className="w-6 h-6" />
            </div>

            <CardDescription>Total de tickets resolvidos</CardDescription>

            <CardContent className="w-full flex items-center gap-2 text-green-700">
              <ArrowBigUpDash className="h-4 w-4" />
              <p className="text-base sm:text-lg font-bold">45%</p>
            </CardContent>
          </CardHeader>
        </Card>
      </section>

      <section className="mt-4">
        <ChartAreaInteractive />
      </section>

      <section className="mt-4 flex flex-col md:flex-row gap-4">
        <Chart />
        <View />
      </section>
    </main>
  );
}
