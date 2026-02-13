"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => { fetchBookings() }, [])

  async function fetchBookings() {
    const { data } = await supabase
      .from("bookings")
      .select(`*, payments(amount, method)`)
      .order("created_at", { ascending: false })
    setBookings(data || [])
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Ref</th>
              <th className="p-2 text-left">Client</th>
              <th className="p-2 text-left">Destination</th>
              <th className="p-2 text-left">Sale</th>
              <th className="p-2 text-left">Purchase</th>
              <th className="p-2 text-left">Profit</th>
              <th className="p-2 text-left">Paid</th>
              <th className="p-2 text-left">Due</th>
              <th className="p-2 text-left">Payments</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b:any) => {
              const totalPaid = b.payments?.reduce((a:any,p:any)=>a+Number(p.amount),0) || 0
              const profit = b.sale_price - b.purchase_price
              const due = b.sale_price - totalPaid
              return (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{b.booking_ref}</td>
                  <td className="p-2">{b.client_name}</td>
                  <td className="p-2">{b.destination}</td>
                  <td className="p-2">£{b.sale_price}</td>
                  <td className="p-2">£{b.purchase_price}</td>
                  <td className="p-2">£{profit}</td>
                  <td className="p-2">£{totalPaid}</td>
                  <td className="p-2 text-red-600">{due > 0 ? `£${due}` : 'Paid'}</td>
                  <td className="p-2">
                    {b.payments?.map((p:any,i:number)=>(
                      <div key={i}>£{p.amount} ({p.method})</div>
                    ))}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
