router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});