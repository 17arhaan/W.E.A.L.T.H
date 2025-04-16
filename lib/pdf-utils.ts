// Implement actual PDF generation using jsPDF
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import 'jspdf-autotable'
import { Investment, Transaction, Goal, Budget, FinancialSummary } from './types'

export async function generatePdfReport(element: HTMLElement, filename: string): Promise<void> {
  const doc = new jsPDF()
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff"
  })

  const imgWidth = 210
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)

  const pageHeight = 297
  let position = -297

  while (position > -canvas.height) {
    doc.addPage()
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
    position -= pageHeight
  }

  doc.save(filename)
}

// Function to save a report to local storage for the "Saved Reports" section
export function saveReportToLocalStorage(report: any): void {
  const reports = JSON.parse(localStorage.getItem('savedReports') || '[]')
  reports.unshift(report)
  if (reports.length > 10) {
    reports.pop()
  }
  localStorage.setItem('savedReports', JSON.stringify(reports))
}

// Function to get saved reports
export function getSavedReports(): any[] {
  return JSON.parse(localStorage.getItem('savedReports') || '[]')
}

export const generatePortfolioPDF = (investments: Investment[]) => {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Investment Portfolio Report', 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)

  const tableData = investments.map(investment => [
    investment.name,
    investment.type,
    `$${investment.currentValue.toLocaleString()}`,
    `$${investment.costBasis.toLocaleString()}`,
    `$${investment.gainLoss.toLocaleString()}`,
    investment.date
  ])

  doc.autoTable({
    startY: 30,
    head: [['Name', 'Type', 'Current Value', 'Cost Basis', 'Gain/Loss', 'Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  })

  return doc
}

export const generateTransactionPDF = (transactions: Transaction[]) => {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Transaction History', 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)

  const tableData = transactions.map(transaction => [
    transaction.date,
    transaction.description,
    transaction.type,
    transaction.category,
    `$${transaction.amount.toLocaleString()}`
  ])

  doc.autoTable({
    startY: 30,
    head: [['Date', 'Description', 'Type', 'Category', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  })

  return doc
}

export const generateFinancialSummaryPDF = (summary: FinancialSummary) => {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Financial Summary Report', 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)

  const tableData = [
    ['Total Assets', `$${summary.totalAssets.toLocaleString()}`],
    ['Total Liabilities', `$${summary.totalLiabilities.toLocaleString()}`],
    ['Net Worth', `$${summary.netWorth.toLocaleString()}`],
    ['Monthly Income', `$${summary.monthlyIncome.toLocaleString()}`],
    ['Monthly Expenses', `$${summary.monthlyExpenses.toLocaleString()}`],
    ['Savings Rate', `${summary.savingsRate.toFixed(2)}%`]
  ]

  doc.autoTable({
    startY: 30,
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  })

  return doc
}
