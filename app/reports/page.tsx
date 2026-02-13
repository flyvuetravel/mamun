"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Papa from "papaparse"

export default function ReportsPage() {
  const [bookings,setBookings] = useState<any[]>([])
  const [month,setMonth] = useState("")

  useEffect(()=>{ fetchData() }, [month])

  async function fetchData() {
    let query = supabase.from("bookings").select(`*, payments(amount, method)`)
    if(month){
      query = query.gte("created_at", `${month}-01`).lt("created_at", `${month}-31`)
    }
    const { data } = await query
    setBookings(data || [])
  }

  function exportCSV(){
    const rows = bookings.map(b=>{
      const totalPaid = b.payments?.reduce((a:any,p:any)=>a+Number(p.amount),0)||0
      return {
        Ref: b.booking_ref,
        Client: b.client_name,
        Destination: b.destination,
        Sale: b.sale_price,
        Purchase: b.purchase_price,
        Profit: b.sale_price-b.purchase_price,
        Paid: totalPaid,
        Due: b.sale_price-totalPaid
      }
    })
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv])
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "report.csv"
    a.click()
  }

  const totalSales = bookings.reduce((a,b)=>a+Number(b.sale_price),0)
  const totalPurchase = bookings.reduce((a,b)=>a+Number(b.purchase_price),0)
  const totalPaid = bookings.reduce((a,b)=>a + (b.payments?.reduce((x,y)=>x+Number(y.amount),0)||0),0)
  const totalProfit = totalSales - totalPurchase
  const totalDue = totalSales - totalPaid

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports</h1>
      <input type="month" className="border p-2 rounded mb-4"
        onChange={e=>setMonth(e.target.value)}/>
      <button onClick={exportCSV} className="bg-black text-white px-4 py-2 rounded ml-2">Export CSV</button>
      <div className="mt-4 space-y-2">
        <p><strong>Total Sales:</strong> £{totalSales}</p>
        <p><strong>Total Purchase:</strong> £{totalPurchase}</p>
        <p><strong>Total Profit:</strong> £{totalProfit}</p>
        <p className="text-red-600"><strong>Total Due:</strong> £{totalDue}</p>
      </div>
    </div>
  )
}
