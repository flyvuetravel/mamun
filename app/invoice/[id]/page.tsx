"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function InvoicePage() {
  const params = useParams()
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => { fetchInvoice() }, [])

  async function fetchInvoice() {
    const { data } = await supabase
      .from("bookings")
      .select(`*, payments(amount, method)`)
      .eq("id", params.id)
      .single()
    setBooking(data)
  }

  if (!booking) return <p>Loading...</p>

  const totalPaid = booking.payments?.reduce((a:any,p:any)=>a+Number(p.amount),0) || 0
  const profit = booking.sale_price - booking.purchase_price
  const due = booking.sale_price - totalPaid

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Invoice: {booking.booking_ref}</h1>
      <p><strong>Client:</strong> {booking.client_name}</p>
      <p><strong>Destination:</strong> {booking.destination}</p>
      <hr className="my-2"/>
      <p><strong>Sale Price:</strong> £{booking.sale_price}</p>
      <p><strong>Purchase Price:</strong> £{booking.purchase_price}</p>
      <p><strong>Profit:</strong> £{profit}</p>
      <p><strong>Paid:</strong> £{totalPaid}</p>
      <p className="text-red-600"><strong>Due:</strong> £{due}</p>
      <hr className="my-2"/>
      <h2 className="font-semibold">Payments</h2>
      {booking.payments?.map((p:any,i:number)=>(
        <p key={i}>£{p.amount} ({p.method})</p>
      ))}
      <button onClick={()=>window.print()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Print Invoice</button>
    </div>
  )
}
