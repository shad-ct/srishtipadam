
const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">About Srishtipadham</h1>
      
      <div className="prose dark:prose-invert prose-lg max-w-none">
        <p className="lead text-xl text-text-secondary text-center mb-12">
          Srishtipadham is a literary and cultural organization dedicated to promoting reading, writing, and a deep appreciation for nature.
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <div className="bg-surface p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
            <p>
              To foster a community of readers and writers who are deeply connected to their cultural roots and the natural environment. We believe in the power of literature to inspire change and build a sustainable future.
            </p>
          </div>
          
          <div className="bg-surface p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4 text-primary">What We Do</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Publish books and magazines</li>
              <li>Organize literary events and discussions</li>
              <li>Promote environmental awareness</li>
              <li>Support emerging writers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
