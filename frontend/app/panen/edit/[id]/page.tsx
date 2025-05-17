import Link from "next/link";
import EditPanenForm from "@/components/EditPanenForm";

export default function EditPanenPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link href="/panen" className="text-primary-dark hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Data Panen
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <EditPanenForm panenId={params.id} />
      </div>
    </div>
  );
}
