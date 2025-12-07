export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Jobs Tracker
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Welcome to your personal job application kanban board!
            </p>
            <p className="text-base text-gray-500 mb-8">
              Track your job applications, organize them by status, and never lose track of opportunities again.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
