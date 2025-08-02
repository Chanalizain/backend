import * as journalistRepository from "../repositories/journalistRepository.js";

export async function getAllJournalists(req, res) {
  try {
    const journalists = await journalistRepository.getAllJournalists();
    res.json(journalists);
  } catch (error) {
    console.error("Error fetching journalists:", error);
    res.status(500).json({ message: "Server error" });
  }
}