const gradientClasses = [
    // Warm earth tones
    "bg-gradient-to-r from-orange-50 via-amber-100 to-stone-200",
    "bg-gradient-to-r from-rose-50 via-orange-50 to-amber-100",
    
    // Cool tones
    "bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-100",
    "bg-gradient-to-r from-cyan-50 via-sky-100 to-blue-200",
    
    // Natural tones
    "bg-gradient-to-r from-emerald-50 via-teal-100 to-cyan-200",
    "bg-gradient-to-r from-stone-100 via-amber-50 to-yellow-100",
    
    // Neutral but distinct
    "bg-gradient-to-r from-zinc-50 via-neutral-100 to-stone-200",
    "bg-gradient-to-r from-slate-100 via-gray-200 to-zinc-300",
    
    // Subtle purples
    "bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-100",
];

export const getRandomGradient = () => {
    return gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
};