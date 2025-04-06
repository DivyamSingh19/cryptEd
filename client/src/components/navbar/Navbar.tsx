 
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
    return (
        <header className="sticky top-0 w-full max-w-7xl mx-auto rounded-full flex   z-100 shadow-md border border-accent gap-6 items-center justify-between p-4 border-b border-b-accent">
         
            <Link href="/" className="flex items-center gap-2">
                
                <span className="font-bold text-xl text-[#011851]">Axoma</span>
            </Link>

            {/* Navbar here */}
            <div className="flex gap-10">
                <Link href="/" className="text-neutral-600 hover:text-black">Home</Link>
                <Link href="/alumni" className="text-neutral-600 hover:text-black">Dashboard</Link>
                <Link href="/jobs" className="text-neutral-600 hover:text-black">Tests</Link>
                
            </div>

            {/* Navbtns here */}
            <div className="flex gap-2">
                <Button className="rounded-full border border-muted-foreground" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        </header>
    )
}