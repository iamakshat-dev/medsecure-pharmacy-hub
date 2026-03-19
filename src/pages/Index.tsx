import {
	Activity,
	ArrowRight,
	Beaker,
	BrainCircuit,
	CalendarClock,
	ChartNoAxesCombined,
	CheckCircle2,
	ChevronRight,
	ClipboardCheck,
	CloudUpload,
	FlaskConical,
	HeartPulse,
	Microscope,
	Moon,
	Pill,
	ScanSearch,
	Search,
	ShieldPlus,
	Sparkles,
	Stethoscope,
	Sun,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/useTheme';

const quickActions = [
	{ label: 'Check Medicine', icon: ScanSearch, href: '#medicine-search' },
	{ label: 'Calculate Dosage', icon: Beaker, href: '#analytics' },
	{ label: 'Track Prescription', icon: ClipboardCheck, href: '#consultation' },
];

const searchSuggestions = ['Amoxicillin 500mg', 'Metformin XR', 'Vitamin D3', 'Cefixime', 'Insulin Glargine'];

const drugCards = [
	{
		name: 'Amoxicillin',
		type: 'Antibiotic',
		status: 'Verified',
		summary: 'Batch integrity, dosage guidelines, contraindications, and supplier traceability.',
		accent: 'from-cyan-200/70 to-white',
	},
	{
		name: 'Metformin XR',
		type: 'Diabetes Care',
		status: 'In Stock',
		summary: 'Usage monitoring, formulation notes, refill indicators, and patient adherence signals.',
		accent: 'from-teal-200/70 to-white',
	},
	{
		name: 'Atorvastatin',
		type: 'Cardiology',
		status: 'Reviewed',
		summary: 'Clinical overview, interaction checks, lipid profile fit, and dispensing recommendations.',
		accent: 'from-sky-200/70 to-white',
	},
];

const analytics = [
	{ label: 'Prescription Accuracy', value: '98.4%', delta: '+2.1%' },
	{ label: 'Smart Refill Alerts', value: '1,248', delta: '+18%' },
	{ label: 'Critical Interactions Flagged', value: '43', delta: '-12%' },
	{ label: 'Lab Sync Uptime', value: '99.97%', delta: 'Stable' },
];

const consultations = [
	{ doctor: 'Dr. Maya Chen', specialty: 'Clinical Pharmacology', time: '09:30 AM', mode: 'Video consult' },
	{ doctor: 'Dr. Arjun Verma', specialty: 'Internal Medicine', time: '11:15 AM', mode: 'Prescription review' },
];

const labReports = [
	{ title: 'CBC Panel', status: 'Ready', detail: 'Hemoglobin, WBC, platelets normalized' },
	{ title: 'Liver Function', status: 'Pending', detail: 'Awaiting ALT and AST confirmation' },
	{ title: 'HbA1c Snapshot', status: 'Updated', detail: '6.7% with improved 30-day trend' },
];

const footerLinks = ['Platform', 'Compliance', 'API', 'Support'];

export default function Index() {
	const { isDark, mounted, isTransitioning, toggle: toggleTheme } = useTheme();

	return (
		<div className="relative min-h-screen overflow-hidden bg-background text-foreground">
			<div className="pointer-events-none absolute inset-0">
				<div className="medical-grid absolute inset-0 opacity-40" />
				<div className="medical-orb absolute -left-16 top-24 h-56 w-56 animate-pulse-soft" />
				<div className="medical-orb medical-orb-secondary absolute right-0 top-16 h-72 w-72 animate-float" />
				<div className="medical-orb medical-orb-tertiary absolute bottom-24 left-1/3 h-48 w-48 animate-pulse-soft [animation-delay:1.2s]" />
				<div className="dna-strand absolute left-8 top-28 hidden h-80 w-16 lg:block" />
				<div className="capsule-float absolute right-16 top-32 hidden lg:block" />
			</div>

			<div className="relative z-10">
				<section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-8">
					<header className="glass sticky top-4 z-20 rounded-full border border-white/60 px-4 py-3 shadow-card backdrop-blur-xl sm:px-6">
						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-primary text-white shadow-[0_18px_34px_-18px_rgba(15,118,110,0.75)]">
									<Pill className="h-5 w-5" />
								</div>
								<div>
									<div className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/80">PharmaMed</div>
									<div className="text-xs text-muted-foreground">Clinical intelligence for pharmacies and care teams</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={toggleTheme}
									className={`rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/70 hover:text-foreground dark:hover:bg-white/10 ${
										isTransitioning ? 'theme-toggle-animate' : ''
									}`}
									aria-label="Toggle theme"
								>
									{mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
								</button>

								<div className="hidden items-center gap-2 md:flex">
								<Badge variant="outline" className="border-primary/15 bg-card/70 px-3 py-1 text-xs font-semibold text-primary">
									Hospital-grade trust
								</Badge>
								<Button asChild variant="ghost" className="rounded-full px-5 text-sm text-foreground hover:bg-card/70">
									<Link to="/login">Login</Link>
								</Button>
								<Button asChild variant="ghost" className="rounded-full px-5 text-sm text-foreground hover:bg-card/70">
									<Link to="/dashboard">Open Dashboard</Link>
								</Button>
								</div>
							</div>
						</div>
					</header>

					<div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start xl:gap-10">
						<div className="pt-4 lg:pt-10">
							<Badge className="animate-fade-up rounded-full border border-primary/20 bg-card/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-primary shadow-sm backdrop-blur-sm">
								Future-ready pharmacy platform
							</Badge>
							<h1 className="animate-fade-up mt-6 max-w-3xl text-5xl font-semibold leading-[1.03] text-balance text-secondary sm:text-6xl xl:text-7xl [animation-delay:120ms]">
								Precision Healthcare. Smarter Pharmacy.
							</h1>
							<p className="animate-fade-up mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg [animation-delay:220ms]">
								PharmaMed brings medication intelligence, dosage support, prescription tracking, and consultation workflows
								into one calm, clinical interface designed for modern care delivery.
							</p>

							<div className="animate-fade-up mt-8 flex flex-wrap gap-3 [animation-delay:320ms]">
								{quickActions.map(({ label, icon: Icon, href }) => (
									<Button
										key={label}
										asChild
										className="h-12 rounded-full gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_22px_44px_-24px_rgba(15,118,110,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
									>
										<a href={href}>
											<Icon className="h-4 w-4" />
											{label}
										</a>
									</Button>
								))}
							</div>

							<div className="animate-fade-up mt-10 flex items-center gap-4 rounded-[2rem] border border-border/60 bg-card/72 px-5 py-4 shadow-card backdrop-blur-xl [animation-delay:420ms]">
								<div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-accent text-secondary">
									<HeartPulse className="h-7 w-7" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-3 text-sm font-semibold text-secondary">
										<span>Live patient-safety pulse</span>
										<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">Stable network</span>
									</div>
									<div className="mt-3 pulse-track">
										<div className="pulse-line" />
									</div>
								</div>
							</div>
						</div>

						<div className="grid gap-4 lg:gap-5">
							<div className="glass animate-fade-up rounded-[2rem] border border-border/50 p-4 shadow-card sm:p-5 [animation-delay:180ms]">
								<div className="rounded-[1.75rem] border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
									<div className="flex items-center justify-between gap-3">
										<div>
											<div className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">Care overview</div>
											<h2 className="mt-2 text-2xl font-semibold text-secondary">Medical command center</h2>
										</div>
										<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-primary">
											<Sparkles className="h-5 w-5" />
										</div>
									</div>

									<div className="mt-6 grid gap-3 sm:grid-cols-3">
										{analytics.slice(0, 3).map((item) => (
											<div key={item.label} className="rounded-2xl border border-border/60 bg-accent/40 p-4">
												<div className="text-sm text-muted-foreground">{item.label}</div>
												<div className="mt-2 text-2xl font-semibold text-secondary">{item.value}</div>
												<div className="mt-1 text-xs font-semibold text-emerald-600">{item.delta}</div>
											</div>
										))}
									</div>

									<div className="mt-5 rounded-[1.5rem] border border-border/60 bg-secondary px-4 py-5 text-secondary-foreground shadow-[0_28px_60px_-38px_rgba(15,23,42,0.8)]">
										<div className="flex items-center justify-between gap-3">
											<div>
												<div className="text-xs uppercase tracking-[0.24em] text-secondary-foreground/70">Therapy balance</div>
												<div className="mt-1 text-lg font-semibold">Adherence trend</div>
											</div>
											<ChartNoAxesCombined className="h-5 w-5 text-primary" />
										</div>
										<div className="mt-5 flex items-end gap-2">
											{[42, 64, 58, 77, 73, 89, 96].map((height, index) => (
												<div key={height} className="flex-1">
													<div
														className="rounded-t-full bg-[linear-gradient(180deg,rgba(125,211,252,0.95),rgba(45,212,191,0.65))]"
														style={{ height: `${height}px`, opacity: 0.55 + index * 0.06 }}
													/>
												</div>
											))}
										</div>
										<div className="mt-4 flex items-center justify-between text-xs text-secondary-foreground/70">
											<span>Week 1</span>
											<span>Week 7</span>
										</div>
									</div>
								</div>
							</div>

							<div className="grid gap-4 sm:grid-cols-2">
								<div className="glass animate-fade-up rounded-[2rem] border border-border/50 p-5 shadow-card [animation-delay:280ms]">
									<div className="rounded-[1.5rem] border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
										<div className="flex items-center justify-between gap-3">
											<div>
												<div className="text-sm font-semibold text-secondary">Medication confidence</div>
												<div className="mt-1 text-3xl font-semibold text-primary">96%</div>
											</div>
											<ShieldPlus className="h-8 w-8 text-primary" />
										</div>
										<p className="mt-4 text-sm leading-6 text-muted-foreground">
											Verified formulations, supplier integrity checks, and automated safety reviews.
										</p>
									</div>
								</div>

								<div className="glass animate-fade-up rounded-[2rem] border border-border/50 p-5 shadow-card [animation-delay:360ms]">
									<div className="rounded-[1.5rem] border border-border/50 bg-card/80 p-5 backdrop-blur-xl">
										<div className="flex items-center justify-between gap-3">
											<div>
												<div className="text-sm font-semibold text-secondary">Smart consultations</div>
												<div className="mt-1 text-3xl font-semibold text-primary">18 today</div>
											</div>
											<Stethoscope className="h-8 w-8 text-primary" />
										</div>
										<p className="mt-4 text-sm leading-6 text-muted-foreground">
											Synced appointment streams for doctors, pharmacists, and patient-facing care plans.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<main className="mx-auto max-w-7xl space-y-8 px-4 pb-16 sm:px-6 lg:space-y-10 lg:px-8 lg:pb-24">
					<section id="medicine-search" className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
						<div className="glass rounded-[2rem] border border-border/50 p-5 shadow-card sm:p-6">
							<div className="rounded-[1.6rem] border border-border/50 bg-card/82 p-5 backdrop-blur-xl sm:p-6">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div>
										<Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Medicine Search</Badge>
										<h2 className="mt-4 text-3xl font-semibold text-secondary">Search medication intelligence instantly</h2>
										<p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
											Query medicines, compare formulations, review contraindications, and access AI-assisted smart suggestions.
										</p>
									</div>
									<Microscope className="hidden h-10 w-10 text-primary/70 sm:block" />
								</div>

								<div className="mt-6 rounded-[1.6rem] border border-primary/10 bg-card p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
									<div className="flex flex-col gap-3 md:flex-row">
										<div className="relative flex-1">
											<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
											<Input
												placeholder="Search medicine, compound, indication, or barcode"
												className="h-14 rounded-[1.2rem] border-0 bg-muted/70 pl-12 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-primary/30"
											/>
										</div>
										<Button className="h-14 rounded-[1.2rem] gradient-primary px-6 text-sm font-semibold text-primary-foreground">
											Smart Analyze
											<ArrowRight className="h-4 w-4" />
										</Button>
									</div>

									<div className="mt-4 flex flex-wrap gap-2">
										{searchSuggestions.map((suggestion) => (
											<button
												key={suggestion}
												type="button"
												className="rounded-full border border-border bg-muted/60 px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-card hover:text-primary"
											>
												{suggestion}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="glass rounded-[2rem] border border-border/50 p-5 shadow-card sm:p-6">
							<div className="rounded-[1.6rem] border border-border/50 bg-card/82 p-5 backdrop-blur-xl sm:p-6">
								<div className="flex items-center justify-between gap-4">
									<div>
										<Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Quick Upload</Badge>
										<h2 className="mt-4 text-2xl font-semibold text-secondary">Prescription upload card</h2>
									</div>
									<CloudUpload className="h-8 w-8 text-primary" />
								</div>
								<div className="mt-5 rounded-[1.5rem] border border-dashed border-primary/25 bg-accent/25 p-6 text-center">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl gradient-accent text-secondary shadow-sm">
										<ClipboardCheck className="h-8 w-8" />
									</div>
									<h3 className="mt-4 text-lg font-semibold text-secondary">Drop a prescription or lab file</h3>
									<p className="mt-2 text-sm leading-6 text-muted-foreground">
										Upload scanned prescriptions, digital files, or care plans for instant validation and routing.
									</p>
									<div className="mt-5 flex flex-wrap justify-center gap-3">
										<Button className="rounded-full gradient-primary px-5 text-primary-foreground">Upload File</Button>
										<Button variant="outline" className="rounded-full border-primary/15 bg-card px-5 text-primary hover:bg-accent">View Templates</Button>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
						<div>
							<div className="mb-4 flex items-end justify-between gap-4">
								<div>
									<Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Drug Intelligence</Badge>
									<h2 className="mt-4 text-3xl font-semibold text-secondary">Evidence-backed drug information cards</h2>
								</div>
								<Button variant="ghost" className="rounded-full text-primary hover:bg-card/70">
									View formulary
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>

							<div className="grid gap-4 xl:grid-cols-3">
								{drugCards.map((card) => (
									<article key={card.name} className="glass rounded-[2rem] border border-border/50 p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-36px_rgba(14,116,144,0.45)]">
										<div className={`rounded-[1.6rem] border border-border/50 bg-gradient-to-br ${card.accent} p-5 backdrop-blur-xl dark:from-card dark:to-accent/40`}>
											<div className="flex items-start justify-between gap-3">
												<div>
													<div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">{card.type}</div>
													<h3 className="mt-2 text-xl font-semibold text-secondary">{card.name}</h3>
												</div>
												<Badge className="border-none bg-card/90 text-primary shadow-sm">{card.status}</Badge>
											</div>
											<p className="mt-4 text-sm leading-7 text-muted-foreground">{card.summary}</p>
											<div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
												<span>Clinical review</span>
												<span className="font-semibold text-primary">Updated 12m ago</span>
											</div>
										</div>
									</article>
								))}
							</div>
						</div>

						<div id="analytics" className="glass rounded-[2rem] border border-border/50 p-5 shadow-card sm:p-6">
							<div className="rounded-[1.6rem] border border-border/50 bg-card/82 p-5 backdrop-blur-xl sm:p-6">
								<div className="flex items-start justify-between gap-4">
									<div>
										<Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Analytics</Badge>
										<h2 className="mt-4 text-2xl font-semibold text-secondary">Clinical metrics and health widgets</h2>
									</div>
									<BrainCircuit className="h-8 w-8 text-primary" />
								</div>

								<div className="mt-6 grid gap-3 sm:grid-cols-2">
									{analytics.map((item) => (
										<div key={item.label} className="rounded-[1.4rem] border border-border/60 bg-muted/60 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-card">
											<div className="text-sm text-muted-foreground">{item.label}</div>
											<div className="mt-2 flex items-end justify-between gap-3">
												<span className="text-2xl font-semibold text-secondary">{item.value}</span>
												<span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-500">{item.delta}</span>
											</div>
										</div>
									))}
								</div>

								<div className="mt-6 rounded-[1.5rem] border border-border/60 bg-accent/35 p-4">
									<div className="flex items-center gap-3">
										<Activity className="h-5 w-5 text-primary" />
										<span className="text-sm font-semibold text-secondary">Medication response forecast</span>
									</div>
									<div className="mt-4 grid grid-cols-12 gap-2">
										{[60, 75, 68, 88, 84, 91, 78, 95, 86, 90, 98, 93].map((value) => (
											<div key={value} className="flex items-end">
												<div className="w-full rounded-full bg-[linear-gradient(180deg,rgba(34,211,238,0.95),rgba(20,184,166,0.55))]" style={{ height: `${value}px` }} />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</section>

					<section id="consultation" className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
						<div className="glass rounded-[2rem] border border-border/50 p-5 shadow-card sm:p-6">
							<div className="rounded-[1.6rem] border border-border/50 bg-card/82 p-5 backdrop-blur-xl sm:p-6">
								<div className="flex items-start justify-between gap-4">
									<div>
										<Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Consultation Panel</Badge>
										<h2 className="mt-4 text-2xl font-semibold text-secondary">Doctor and pharmacist coordination</h2>
									</div>
									<CalendarClock className="h-8 w-8 text-primary" />
								</div>

								<div className="mt-6 space-y-3">
									{consultations.map((item) => (
										<div key={item.doctor} className="rounded-[1.5rem] border border-border/60 bg-muted/60 p-4 transition-all duration-300 hover:border-primary/20 hover:bg-card">
											<div className="flex items-start justify-between gap-3">
												<div>
													<div className="text-lg font-semibold text-secondary">{item.doctor}</div>
													<div className="mt-1 text-sm text-muted-foreground">{item.specialty}</div>
												</div>
												<Badge className="border-none bg-primary/15 text-primary">{item.mode}</Badge>
											</div>
											<div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
												<span>{item.time}</span>
												<button type="button" className="font-semibold text-primary transition-colors hover:text-secondary">Open consult</button>
											</div>
										</div>
									))}
								</div>

								<div className="mt-5 rounded-[1.5rem] border border-primary/10 bg-accent/25 p-4">
									<div className="flex items-center gap-3">
										<CheckCircle2 className="h-5 w-5 text-emerald-600" />
										<span className="text-sm font-semibold text-secondary">Triage queue synchronized across devices</span>
									</div>
								</div>
							</div>
						</div>

						<div className="glass rounded-[2rem] border border-border/50 p-5 shadow-card sm:p-6">
							<div className="rounded-[1.6rem] border border-border/50 bg-card/82 p-5 backdrop-blur-xl sm:p-6">
								<div className="flex items-start justify-between gap-4">
									<div>
										<Badge variant="outline" className="border-primary/15 bg-primary/5 text-primary">Lab Reports</Badge>
										<h2 className="mt-4 text-2xl font-semibold text-secondary">Preview cards for diagnostics and care follow-up</h2>
									</div>
									<FlaskConical className="h-8 w-8 text-primary" />
								</div>

								<div className="mt-6 grid gap-4 md:grid-cols-3">
									{labReports.map((report) => (
										<article key={report.title} className="rounded-[1.5rem] border border-border/60 bg-muted/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-card">
											<div className="flex items-center justify-between gap-3">
												<div className="text-base font-semibold text-secondary">{report.title}</div>
												<Badge className="border-none bg-card text-primary shadow-sm">{report.status}</Badge>
											</div>
											<p className="mt-4 text-sm leading-6 text-muted-foreground">{report.detail}</p>
											<div className="mt-5 h-28 rounded-[1.2rem] border border-border/50 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_50%),linear-gradient(180deg,hsl(var(--card)),hsl(var(--muted)))] p-3">
												<div className="flex h-full items-end gap-2">
													{[35, 52, 40, 68, 55].map((height, index) => (
														<div key={height} className="flex-1 rounded-full bg-[linear-gradient(180deg,rgba(56,189,248,0.85),rgba(45,212,191,0.45))]" style={{ height: `${height + index * 3}px` }} />
													))}
												</div>
											</div>
										</article>
									))}
								</div>
							</div>
						</div>
					</section>
				</main>

				<footer className="border-t border-border/50 bg-card/55 backdrop-blur-xl">
					<div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
						<div>
							<div className="text-lg font-semibold text-secondary">PharmaMed</div>
							<p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
								Clean medical infrastructure for pharmacy operations, safer prescriptions, and connected patient care.
							</p>
						</div>
						<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
							{footerLinks.map((link) => (
								<a key={link} href="#" className="transition-colors hover:text-primary">
									{link}
								</a>
							))}
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
