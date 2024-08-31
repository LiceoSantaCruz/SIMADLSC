
export const HeroSection = () => {
  return (
     <div>
        
      <section className="h-96 flex items-center justify-center relative bg-hero">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative p-10 text-center text-white" data-aos="fade-up">
        <h2 className="text-5xl font-bold">Bienvenido al Liceo Santa Cruz</h2>
        <p className="mt-4 text-lg">Donde la educación secundaria es una aventura.</p>
      </div>
      </section>
     </div>
  )
}
