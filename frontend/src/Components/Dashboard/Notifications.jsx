const Notifications = () => {
  const notifications = [
    { date: '2025-02-20', message: 'Parent-Teacher Meeting on Feb 28.' },
    { date: '2025-02-22', message: 'Science project submission deadline extended to March 5.' },
    { date: '2025-02-23', message: 'School holiday on March 1 for Holi festival.' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <ul>
        {notifications.map((note, index) => (
          <li key={index} className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-gray-500 text-sm">{note.date}</p>
            <p className="font-medium">{note.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
