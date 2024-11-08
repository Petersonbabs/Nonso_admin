"use client"

import { ReactNode } from "react"
import { MainNav } from "./components/MainNav"
// import { redirect } from "next/navigation"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // const adminId = localStorage.getItem('adminId')


  // if(!adminId){
  //   redirect('/')
  // }

  return (
    <>
      {/* TAB & SEARCH */}
      <div className="border-y shadow z-20 bg-white fixed bottom-0 sm:sticky sm:top-0 w-full ">
        <div className="flex py-4 gap-4 items-center px-4 flex-wrap justify-between ">
          <MainNav />
        </div>
      </div>
      {/* TAB & SEARCH */}
      <section className="pb-24">
        {children}
      </section>
    </>
  )
}