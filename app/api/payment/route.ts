import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantId, amount, customerName } = body;

    if (!merchantId || !amount || !customerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        merchantId,
        amount: parseFloat(amount),
        customerName,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment failed" },
      { status: 500 }
    );
  }
}
