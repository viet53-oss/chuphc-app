'use client';

import { ShieldAlert, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function RiskyPage() {
    return (
        <div className="fade-in flex flex-col w-full pb-24 gap-4">
            <section className="app-section !border-black bg-[#0ea5e910]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0ea5e9] text-white flex items-center justify-center">
                        <ShieldAlert size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-small opacity-60">Safety Index</span>
                        <h2 className="title-md">Minimal Risks Found</h2>
                    </div>
                </div>
            </section>

            <section className="app-section border-black">
                <div className="flex flex-col gap-6">
                    <h3 className="title-md">Substance Monitoring</h3>

                    <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-primary" size={20} />
                            <span className="title-md">Alcohol</span>
                        </div>
                        <span className="text-small opacity-60">0 units logged</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="text-primary" size={20} />
                            <span className="title-md">Tobacco</span>
                        </div>
                        <span className="text-small opacity-60">Non-smoker</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border-2 border-primary/20">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-primary" size={20} />
                            <span className="title-md">Environment</span>
                        </div>
                        <span className="text-small text-primary">High UV Alert</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
