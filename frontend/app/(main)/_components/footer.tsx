import { Logo } from "../../../components/logo"
import { Button } from "@/components/ui/button";

export const Footer = () => {
    return (
        // dark:bg-[#191919]
        <div className="flex items-center w-full p-6 bg-background z-50">
            <Logo />      
            <div className="ml-auto w-full
            justify-end flex items-center gap-x-2
            text-muted-foreground">
                <Button variant="ghost" size="sm">
                    Privacy Policy
                </Button>
                <Button variant="ghost" size="sm">
                    Terms & Conditions
                </Button>
            </div>
        </div>
    )
}