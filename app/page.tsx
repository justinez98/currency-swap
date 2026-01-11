import { SwapInterface } from "@/components/SwapInterface";
import { CurrencyTicker } from "@/components/CurrencyTicker";
import { PageTitle } from "@/components/PageTitle";

export default function Home() {
    return (
        <main className="min-h-screen bg-black py-8 sm:py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <PageTitle />
                <CurrencyTicker />
                <SwapInterface />
            </div>
        </main>
    );
}
