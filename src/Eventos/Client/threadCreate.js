module.exports ={
  name: "threadCreate",
  run: async (client, thread) => {
    if (thread.joinable()) {
      try {
        await thread.join()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
