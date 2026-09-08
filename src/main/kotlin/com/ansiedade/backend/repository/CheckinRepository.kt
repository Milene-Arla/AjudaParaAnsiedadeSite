package com.ansiedade.backend.repository

import com.ansiedade.backend.model.Checkin
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CheckinRepository : JpaRepository<Checkin, Long> {
    fun findByCodigoAcompanhamentoOrderByDataRegistroDesc(codigo: String): List<Checkin>
}