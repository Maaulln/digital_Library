"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface PaymentButtonProps {
  user_id: number;
  borrowing_id: number;
  amount: number;
  onSuccess?: () => void;
}

export default function PaymentButton({ user_id, borrowing_id, amount, onSuccess }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Error",
        description: "Silakan pilih metode pembayaran",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Buat pembayaran
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          borrowing_id,
          amount,
          payment_method: selectedMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat pembayaran");
      }

      const data = await response.json();

      // Update status pembayaran
      const updateResponse = await fetch("/api/payment/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrowing_id,
          status: "success",
          payment_type: selectedMethod
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Gagal memperbarui status pembayaran");
      }

      // Tampilkan alert sukses
      alert(`Pembayaran Berhasil!\nMetode: ${selectedMethod}\nJumlah yang dibayar: Rp${amount.toLocaleString()}\nStatus: Sukses`);

      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      // Tampilkan alert gagal
      alert(`Pembayaran Gagal!\nPesan: ${error.message}`);
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          Bayar Denda Rp{amount.toLocaleString()}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Metode Pembayaran</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="QRIS" id="qris" />
              <Label htmlFor="qris">QRIS</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="DANA" id="dana" />
              <Label htmlFor="dana">DANA</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="OVO" id="ovo" />
              <Label htmlFor="ovo">OVO</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="GOPAY" id="gopay" />
              <Label htmlFor="gopay">GOPAY</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end">
          <Button 
            onClick={handlePayment} 
            disabled={isLoading || !selectedMethod}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {isLoading ? "Memproses..." : "Lanjutkan Pembayaran"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}