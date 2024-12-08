package com.example.manajementugasrealtime

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.manajementugasrealtime.api.RetrofitInstance
import com.example.manajementugasrealtime.model.LoginRequest
import com.example.manajementugasrealtime.model.LoginResponse
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import androidx.lifecycle.lifecycleScope

class ApiService : AppCompatActivity() {

    private lateinit var socket: Socket

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Koneksi ke server socket
        try {
            socket = IO.socket("http://localhost:5000/")
            socket.connect()

            // Mendengarkan event "taskUpdated" dari server
            socket.on("taskUpdated", Emitter.Listener { args ->
                // Update UI berdasarkan data task yang diterima
                // Misalnya, jika args berisi data task yang terbaru:
                val updatedTask = args[0] as String // Sesuaikan dengan data yang dikirim
                runOnUiThread {
                    Toast.makeText(this, "Task updated: $updatedTask", Toast.LENGTH_SHORT).show()
                }
            })
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // Panggilan API untuk login sebagai contoh
        val loginRequest = LoginRequest("jidan@gmail.com", "password")

        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.apiService.login(loginRequest)

                if (response.isSuccessful) {
                    val loginResponse = response.body()
                    Toast.makeText(this@ApiService, "Login successful! Token: ${loginResponse?.token}", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(this@ApiService, "Login failed", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@ApiService, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        // Disconnect dari socket saat activity dihancurkan
        socket.disconnect()
    }
}
