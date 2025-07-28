export default function FooterPage() {
    return (
        <footer className="border-t-[8px] border-black py-6 px-8 bg-gradient-to-r from-[#fafafa] to-[#f0f0f0] text-center text-sm font-mono text-gray-600">
            © {new Date().getFullYear()} MyForm Builder. All rights reserved.
        </footer>
    )
}
