import BookSearch from '@/components/book-search'

export default function Home() {
  return (
    <div className="trinity-bg">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-6xl text-center mb-8 text-amber-200 font-bold drop-shadow-2xl">
          TRINITY COLLEGE LIBRARY
        </h1>
        <p className="text-center text-amber-200 mb-8 font-extrabold text-lg drop-shadow-lg">
          <i>If you need your f*cking book, you are wrong place. Just get a pint.</i>
        </p>
        
        <BookSearch />
      </main>
    </div>
  )
}
                                        