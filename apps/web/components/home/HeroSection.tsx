import { Scene } from "../3d/home/Scene"

export function HeroSection() {
    return (
        <div className="w-full text-light-text dark:text-dark-text">
            <div className="w-full h-[90vh]  flex flex-col py-2">
                <div className="w-full h-[85%] px-6 md:px-8 flex flex-col relative">

                    <div className="Name relative z-30 pointer-events-none">
                        <h2 className="text-3xl text-light-text dark:text-dark-text mt-1">F-22 Raptor</h2>
                        <p className="text-light-muted dark:text-dark-muted text-[15px] leading-relaxed flex-grow">Air Superiority Fighter</p>

                        <div className="pt-2 px-1 flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#EFE9DE]"></div>
                            <div className="w-6 h-6 rounded-full bg-[#EFE9DE]"></div>
                            <div className="w-6 h-6 rounded-full bg-[#8E8B82]"></div>
                            <div className="w-6 h-6 rounded-full bg-[#141413]"></div>
                        </div>
                    </div>

                    
                    <div className="w-full flex-grow flex justify-center items-end relative z-20 pointer-events-none">
                        
                       
                        <div className="absolute inset-y-0 -left-6 -right-6 md:-left-8 md:-right-8 z-10 pointer-events-auto">
                            <Scene />
                        </div>

                        <div className="w-full h-[25%] flex justify-center items-center absolute bottom-0 left-0">
                            
                         
                            <div className="absolute w-[90%] max-w-5xl h-[140px] rounded-[50%] border border-light-border dark:border-dark-border border-b-transparent dark:border-b-transparent z-0"></div>

                        
                            <div className="absolute w-[90%] max-w-5xl h-[140px] rounded-[50%] border border-light-border dark:border-dark-border border-t-transparent dark:border-t-transparent flex justify-center items-end pointer-events-none z-20">
                                {/* 360 Control Button */}
                                <button className="absolute bottom-0 translate-y-1/2 w-12 h-12 rounded-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border flex items-center justify-between px-3 text-light-text dark:text-dark-text pointer-events-auto z-30">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                                </button>
                                <span className="absolute bottom-0 translate-y-[40px] text-[11px] font-medium text-light-muted dark:text-dark-muted tracking-wide pl-0.5">360&deg;</span>
                            </div>
                        </div>


                        {/* Card 1 (Top Left) */}
                        <div className="absolute top-[10%] left-6 md:left-10 group z-20 pointer-events-auto">
                            {/* Angled Connector Line */}
                            <svg className="absolute top-1/2 left-[100%] w-[80px] md:w-[120px] h-[80px] overflow-visible z-0 pointer-events-none" viewBox="0 0 120 80" fill="none">
                                <path d="M 0 0 L 60 0 L 120 80" stroke="currentColor" strokeWidth="1" className="text-light-text/30 dark:text-dark-text/30" />
                                <circle cx="120" cy="80" r="2.5" fill="currentColor" className="text-light-text dark:text-dark-text" />
                            </svg>
                            
                            {/* Card Content */}
                            <div className="relative w-[180px] md:w-[200px] rounded-[16px] border border-light-border dark:border-dark-border bg-white/90 dark:bg-dark-bg/90 flex flex-col p-2 shadow-sm z-10 cursor-default">
                                <div className="px-2 pt-1 pb-2 border-b border-light-border dark:border-dark-border">
                                    <h3 className="text-[12px] font-medium font-sans text-light-text dark:text-dark-text tracking-wide">
                                        Brembo Calipers
                                    </h3>
                                </div>
                                <div className="w-full h-[90px] md:h-[100px] mt-2 rounded-[12px] bg-light-surface/80 dark:bg-[#161618]/80 flex items-center justify-center overflow-hidden">
                                    <span className="text-light-muted dark:text-dark-muted text-[9px] font-medium tracking-widest uppercase">Insert Image</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 (Top Right) */}
                        <div className="absolute top-[-5%] right-6 md:right-10 group z-20 pointer-events-auto">
                            {/* Angled Connector Line */}
                            <svg className="absolute top-1/2 right-[100%] w-[80px] md:w-[120px] h-[60px] overflow-visible z-0 pointer-events-none" viewBox="0 0 120 60" fill="none">
                                <path d="M 120 0 L 60 0 L 0 60" stroke="currentColor" strokeWidth="1" className="text-light-text/30 dark:text-dark-text/30" />
                                <circle cx="0" cy="60" r="2.5" fill="currentColor" className="text-light-text dark:text-dark-text" />
                            </svg>
                            
                            {/* Card Content */}
                            <div className="relative w-[180px] md:w-[200px] rounded-[16px] border border-light-border dark:border-dark-border bg-white/90 dark:bg-dark-bg/90 flex flex-col p-2 shadow-sm z-10 cursor-default">
                                <div className="px-2 pt-1 pb-2 border-b border-light-border dark:border-dark-border">
                                    <h3 className="text-[12px] font-medium font-sans text-light-text dark:text-dark-text tracking-wide">
                                        Flight Specifications
                                    </h3>
                                </div>
                                <div className="w-full mt-2.5 px-2 pb-1.5 flex flex-col gap-3">
                                    <div className="flex flex-col">
                                        <span className="text-light-muted dark:text-dark-muted text-[9px] font-semibold uppercase tracking-widest">Max Flight Time</span>
                                        <span className="text-light-text dark:text-dark-text text-[14px] font-medium font-sans mt-0.5">300 Hours</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-light-muted dark:text-dark-muted text-[9px] font-semibold uppercase tracking-widest">Failure Rate</span>
                                        <span className="text-light-text dark:text-dark-text text-[14px] font-medium font-sans mt-0.5">0.01%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 (Bottom Right) */}
                        <div className="absolute bottom-[-15%] right-8 md:right-16 group z-20 pointer-events-auto">
                            {/* Angled Connector Line (Goes Left and Up) */}
                            <svg className="absolute top-1/2 right-[100%] w-[100px] md:w-[160px] h-[80px] overflow-visible z-0 translate-y-[-100%] pointer-events-none" viewBox="0 0 160 80" fill="none">
                                <path d="M 160 80 L 100 80 L 0 0" stroke="currentColor" strokeWidth="1" className="text-light-text/30 dark:text-dark-text/30" />
                                <circle cx="0" cy="0" r="2.5" fill="currentColor" className="text-light-text dark:text-dark-text" />
                            </svg>
                            
                            {/* Card Content */}
                            <div className="relative w-[180px] md:w-[200px] rounded-[16px] border border-light-border dark:border-dark-border bg-white/90 dark:bg-dark-bg/90 flex flex-col p-2 shadow-sm z-10 cursor-default">
                                <div className="px-2 pt-1 pb-2 border-b border-light-border dark:border-dark-border">
                                    <h3 className="text-[12px] font-medium font-sans text-light-text dark:text-dark-text tracking-wide">
                                        Adaptive Air Suspension
                                    </h3>
                                </div>
                                <div className="w-full h-[90px] md:h-[100px] mt-2 rounded-[12px] bg-light-surface/80 dark:bg-[#161618]/80 flex items-center justify-center overflow-hidden">
                                    <span className="text-light-muted dark:text-dark-muted text-[9px] font-medium tracking-widest uppercase">Insert Image</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>

                <div className="w-full h-[15%]  px-6 md:px-8"></div>
            </div>
        </div>
    )
}
