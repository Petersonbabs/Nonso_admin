"use client"

import Link from "next/link"
import AppData from "@/data/app.json"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"

export function MainNav() {

  const pathName = usePathname()


  return (
    <nav
      className="flex gap-8 text-black justify-between w-full sm:w-fit px-4"
    >
      {
        AppData.header.menu.map(item => (
          <Link key={item.label} href={item.href} className={`${pathName == item.href ? 'text-foreground' : 'text-gray-600'} transition-all flex flex-col items-center `}>
            <span className={` sm:hidden size-4`} dangerouslySetInnerHTML={{__html: item.icon}} />
            <span className='link-text'>{item.label}</span>
          </Link>
        ))
      }
    </nav >
  )
}