'use server'

import { jsPDF } from 'jspdf';
import { generateProfessionalSummary } from '@/lib/gemini';

export async function finalizeCertificate(data: {
    buyerName: string;
    agentName: string;
    terms: string;
    signatureDataUrl: string;
}) {

    // 1. Generate Professional Summary via Gemini
    const summary = await generateProfessionalSummary(data.terms);
    const certId = `DW-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;

    // 2. Create PDF
    const doc = new jsPDF();

    // Branding
    doc.setFontSize(22);
    doc.text('DWELLINGLY', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('COMMISSION INFRASTRUCTURE™ CERTIFICATE', 105, 28, { align: 'center' });

    // Certificate ID & Timestamp
    doc.setFontSize(12);
    doc.text(`Certificate ID: ${certId}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 52);

    // Participants
    doc.line(20, 60, 190, 60);
    doc.text(`Agent: ${data.agentName}`, 20, 70);
    doc.text(`Buyer: ${data.buyerName}`, 20, 77);

    // Terms (The "Protection" Layer)
    doc.setFont("helvetica", "bold");
    doc.text('Verified Terms:', 20, 90);
    doc.setFont("helvetica", "normal");
    const splitSummary = doc.splitTextToSize(summary, 170);
    doc.text(splitSummary, 20, 100);

    // Signature
    doc.addImage(data.signatureDataUrl, 'PNG', 20, 140, 50, 20);
    doc.text('Buyer Digital Signature', 20, 165);

    // 3. Convert to Buffer and mock upload
    const pdfBase64 = doc.output('arraybuffer');

    // In a real scenario, this would be uploaded to storage and DB.
    // For this mock, we just return the success payload.

    return { certId: "mock-" + certId, certificateNumber: certId };
}
