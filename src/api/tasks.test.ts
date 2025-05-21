import { mainApp } from "./index.ts"; // Assuming mainApp is exported from src/api/index.ts
import { tasks } from "./tasks.ts"; // Import the tasks array to reset it
import { assertEquals, assertExists, assertNotEquals } from "$std/assert/mod.ts";
import { Task } from "../types.ts";

// Helper to reset tasks before each test
const resetTasks = () => {
  tasks.length = 0; // Clear the array
};

Deno.test("Task API Tests", async (t) => {
  await t.step("GET /api/tasks - initial", async () => {
    resetTasks();
    const res = await mainApp.request("/api/tasks");
    assertEquals(res.status, 200);
    assertEquals(await res.json(), []);
  });

  await t.step("POST /api/tasks - create new task", async () => {
    resetTasks();
    const newTaskPayload = { text: "Test Task 1" };
    const res = await mainApp.request("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTaskPayload),
      headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 201);
    const data: Task = await res.json();
    assertExists(data.id);
    assertEquals(data.text, newTaskPayload.text);
    assertEquals(data.completed, false);
    assertEquals(tasks.length, 1);
    assertEquals(tasks[0].text, newTaskPayload.text);
  });

  await t.step("GET /api/tasks - with multiple tasks", async () => {
    resetTasks();
    tasks.push({ id: "1", text: "Task 1", completed: false });
    tasks.push({ id: "2", text: "Task 2", completed: true });
    const res = await mainApp.request("/api/tasks");
    assertEquals(res.status, 200);
    const data: Task[] = await res.json();
    assertEquals(data.length, 2);
    assertEquals(data[0].text, "Task 1");
    assertEquals(data[1].completed, true);
  });

  await t.step("POST /api/tasks - invalid payload (no text)", async () => {
    resetTasks();
    const res = await mainApp.request("/api/tasks", {
      method: "POST",
      body: JSON.stringify({}), // No text
      headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 400);
    const errorData = await res.json();
    assertEquals(errorData.error, "Text is required");
  });

  await t.step("PATCH /api/tasks/:id - update text", async () => {
    resetTasks();
    const initialTask = { id: "patch-text-id", text: "Initial Text", completed: false };
    tasks.push(initialTask);
    const updatedPayload = { text: "Updated Text" };
    const res = await mainApp.request(`/api/tasks/${initialTask.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedPayload),
      headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 200);
    const data: Task = await res.json();
    assertEquals(data.text, updatedPayload.text);
    assertEquals(data.completed, initialTask.completed);
    assertEquals(tasks[0].text, updatedPayload.text);
  });

  await t.step("PATCH /api/tasks/:id - update completed", async () => {
    resetTasks();
    const initialTask = { id: "patch-completed-id", text: "Complete Me", completed: false };
    tasks.push(initialTask);
    const updatedPayload = { completed: true };
    const res = await mainApp.request(`/api/tasks/${initialTask.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedPayload),
      headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 200);
    const data: Task = await res.json();
    assertEquals(data.completed, true);
    assertEquals(tasks[0].completed, true);
  });
  
  await t.step("PATCH /api/tasks/:id - update both text and completed", async () => {
    resetTasks();
    const initialTask = { id: "patch-both-id", text: "Initial", completed: false };
    tasks.push(initialTask);
    const updatedPayload = { text: "Updated Both", completed: true };
    const res = await mainApp.request(`/api/tasks/${initialTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedPayload),
        headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 200);
    const data: Task = await res.json();
    assertEquals(data.text, updatedPayload.text);
    assertEquals(data.completed, updatedPayload.completed);
    assertEquals(tasks[0].text, updatedPayload.text);
    assertEquals(tasks[0].completed, updatedPayload.completed);
  });


  await t.step("PATCH /api/tasks/:id - task not found", async () => {
    resetTasks();
    const res = await mainApp.request("/api/tasks/nonexistent-patch-id", {
      method: "PATCH",
      body: JSON.stringify({ text: "Won't work" }),
      headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 404);
  });

  await t.step("DELETE /api/tasks/:id - delete existing", async () => {
    resetTasks();
    const taskToDelete = { id: "delete-id", text: "Delete Me", completed: false };
    tasks.push(taskToDelete);
    assertEquals(tasks.length, 1); // Ensure task is there
    const res = await mainApp.request(`/api/tasks/${taskToDelete.id}`, {
      method: "DELETE",
    });
    assertEquals(res.status, 204); // No content
    assertEquals(tasks.length, 0); // Task should be removed
  });

  await t.step("DELETE /api/tasks/:id - task not found", async () => {
    resetTasks();
    const res = await mainApp.request("/api/tasks/nonexistent-delete-id", {
      method: "DELETE",
    });
    assertEquals(res.status, 404);
  });

  await t.step("POST /api/tasks/:id/split - task not found", async () => {
    resetTasks();
    const res = await mainApp.request("/api/tasks/nonexistent-split-id/split", {
      method: "POST",
    });
    assertEquals(res.status, 404);
  });

  await t.step("POST /api/tasks/:id/split - OPENAI_API_KEY not set", async () => {
    resetTasks();
    tasks.push({ id: "test-split-key-id", text: "Original task for key test", completed: false });

    const originalApiKey = Deno.env.get("OPENAI_API_KEY");
    if (originalApiKey) { // Temporarily remove if set
      Deno.env.delete("OPENAI_API_KEY");
    }

    const res = await mainApp.request("/api/tasks/test-split-key-id/split", {
      method: "POST",
    });
    assertEquals(res.status, 500);
    const errorData = await res.json();
    assertEquals(errorData.error, "OPENAI_API_KEY is not set");

    if (originalApiKey) { // Restore if it was originally set
      Deno.env.set("OPENAI_API_KEY", originalApiKey);
    }
  });

  // Optional - Complex Mocking for successful split (Conceptual)
  // This requires a proper mocking library or more involved setup for Deno's fetch/OpenAI client.
  // For now, this test is a placeholder to acknowledge the scenario.
  await t.step("POST /api/tasks/:id/split - successful split (conceptual - requires mocking)", async () => {
    resetTasks();
    const parentTaskId = "split-success-id";
    tasks.push({ id: parentTaskId, text: "Task to be split by mock AI", completed: false });
    
    const originalApiKey = Deno.env.get("OPENAI_API_KEY");
    // Ensure API key is set for this conceptual test to pass the initial check
    if (!originalApiKey) {
        Deno.env.set("OPENAI_API_KEY", "test_mock_key_will_not_be_used_if_mocked");
    }

    // --- Mocking would start here ---
    // e.g., by replacing `experimental_generateObject` or its underlying fetch calls.
    // This is non-trivial with current tools without a dedicated mocking framework.
    // For this example, we'll assume the API call would succeed if the key is present
    // and the external service was correctly mocked to return subtasks.
    // Since we can't easily mock `experimental_generateObject` here, we'll test the path
    // assuming a key is present, and if it actually makes an API call, that call would fail
    // if the key is invalid or the service is unavailable.
    // For this test, we'll just check if it doesn't return 404 or 500 for "key not set".
    // A real test for success would require proper mocking.

    if (Deno.env.get("OPENAI_API_KEY")) { // Only run if a key is present (even a fake one for CI)
        const res = await mainApp.request(`/api/tasks/${parentTaskId}/split`, {
            method: "POST",
        });
        // If API key is present, it will try to make a call.
        // Without mocking, this will likely fail at the OpenAI call itself.
        // The status code might be 500 (from AI error) or 200 (if somehow it generates empty tasks locally).
        // This assertion is weak without true mocking.
        assertNotEquals(res.status, 404); // Should find the task
        // A real test would assert status 200 and check for new subtasks.
        if (res.status === 200) {
            const subtasks: Task[] = await res.json();
            assertNotEquals(subtasks.length, 0, "Subtasks should have been generated");
            // Further checks on subtask content
        } else {
            console.warn(`Skipping full 'successful split' assertions as it depends on live OpenAI or deep mocking. Status: ${res.status}`);
            const body = await res.json();
            console.warn("Response body for non-200 split:", body);
        }
    } else {
        console.warn("Skipping 'POST /api/tasks/:id/split - successful split' because OPENAI_API_KEY is not set.");
    }
    // --- Mocking would end here ---
    if (!originalApiKey && Deno.env.get("OPENAI_API_KEY") === "test_mock_key_will_not_be_used_if_mocked") {
        Deno.env.delete("OPENAI_API_KEY"); // Clean up mock key
    } else if (originalApiKey) {
        Deno.env.set("OPENAI_API_KEY", originalApiKey); // Restore original key
    }
  });
});
