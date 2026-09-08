package com.ansiedade.backend.exception

import org.springframework.dao.DataAccessException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.http.converter.HttpMessageNotReadableException

data class ApiErrorResponse(
    val message: String,
    val errors: Map<String, String>? = null
)

@RestControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(
        exception: MethodArgumentNotValidException
    ): ResponseEntity<ApiErrorResponse> {
        val errors = exception.bindingResult.fieldErrors
            .associate { it.field to (it.defaultMessage ?: "Valor inválido") }

        return ResponseEntity
            .badRequest()
            .body(ApiErrorResponse("Dados de check-in inválidos", errors))
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleUnreadableMessage(): ResponseEntity<ApiErrorResponse> {
        return ResponseEntity
            .badRequest()
            .body(ApiErrorResponse("O corpo da requisição contém dados inválidos ou campos obrigatórios ausentes"))
    }

    @ExceptionHandler(DataAccessException::class)
    fun handleDatabaseException(): ResponseEntity<ApiErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiErrorResponse("Não foi possível acessar o banco de dados no momento"))
    }
}
