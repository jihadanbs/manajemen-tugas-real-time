package com.example.manajementugasrealtime.api

import com.example.manajementugasrealtime.model.LoginRequest
import com.example.manajementugasrealtime.model.LoginResponse
import com.example.manajementugasrealtime.model.Task
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    // Endpoint untuk login
    @POST("api/auth/login")
    suspend fun login(@Body credentials: LoginRequest): Response<LoginResponse>

    // Endpoint untuk membuat task
    @POST("api/tasks")
    suspend fun createTask(@Body task: Task): Response<Task>
}
