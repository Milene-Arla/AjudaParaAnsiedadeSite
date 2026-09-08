package com.ansiedade.backend.controller

import com.ansiedade.backend.dto.CheckinRequestDto
import com.ansiedade.backend.model.Checkin
import com.ansiedade.backend.repository.CheckinRepository
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/checkins")
class CheckinController(private val checkinRepository: CheckinRepository) {

    @PostMapping
    fun criarCheckin(@Valid @RequestBody request: CheckinRequestDto): ResponseEntity<Checkin> {
        val checkin = Checkin(
            codigoAcompanhamento = request.codigoAcompanhamento,
            nivelAnsiedade = request.nivelAnsiedade!!,
            emocaoPrincipal = request.emocaoPrincipal,
            anotacao = request.anotacao
        )
        val checkinSalvo = checkinRepository.save(checkin)
        return ResponseEntity.status(HttpStatus.CREATED).body(checkinSalvo)
    }

    @GetMapping
    fun listarTodos(): ResponseEntity<List<Checkin>> {
        return ResponseEntity.ok(checkinRepository.findAll())
    }
}