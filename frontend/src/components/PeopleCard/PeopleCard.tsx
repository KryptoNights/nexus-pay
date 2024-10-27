const PeopleCard = () => {
  const people = [
    { name: "Vinit", initial: "V", color: "bg-purple-500" },
    { name: "Meet", initial: "M", color: "bg-green-500" },
    {
      name: "Utsavi",
      image: "https://via.placeholder.com/50",
      color: "bg-none",
    },
    { name: "Ravi", image: "https://via.placeholder.com/50", color: "bg-none" },
    { name: "Shrushti", initial: "S", color: "bg-blue-500" },
    { name: "Rohan", initial: "R", color: "bg-gray-500" },
    {
      name: "Siddh",
      image: "https://via.placeholder.com/50",
      color: "bg-none",
    },
  ];
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-white mb-4">People</h2>
      <div className="grid grid-cols-4 gap-4">
        {people.map((person, index) => (
          <div key={index} className="flex flex-col items-center">
            {person.image ? (
              <img
                src={person.image}
                alt={person.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold ${person.color}`}
              >
                {person.initial}
              </div>
            )}
            <span className="text-white mt-2 text-sm">{person.name}</span>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white">
            <span className="text-white text-2xl">&#9662;</span>
          </div>
          <span className="text-white mt-2 text-sm">More</span>
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
