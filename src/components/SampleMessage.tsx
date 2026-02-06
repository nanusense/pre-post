export default function SampleMessage({ blurred = false }: { blurred?: boolean }) {
  return (
    <div className={`relative ${blurred ? 'select-none' : ''}`}>
      <div
        className={`bg-white border border-gray-200 rounded-lg p-6 ${
          blurred ? 'blur-[6px]' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">Anonymous message</span>
          <span className="text-sm text-gray-400">Feb 6, 2026</span>
        </div>
        <div className="prose prose-gray">
          <p className="text-gray-800 leading-relaxed">
            I&apos;ve been meaning to tell you this for years. You probably don&apos;t
            remember, but that day when I was at my lowest, you reached out. You didn&apos;t
            have to. You barely knew me then. But you did, and it changed everything.
          </p>
          <p className="text-gray-800 leading-relaxed mt-4">
            I never properly thanked you. So here it is: thank you for being the kind of
            person who notices when others are struggling. Thank you for caring.
          </p>
        </div>
      </div>
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600">
            This is what a message looks like
          </div>
        </div>
      )}
    </div>
  )
}
