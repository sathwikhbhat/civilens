package com.databaes.civilens.persona.service;

import com.databaes.civilens.persona.model.Persona;
import com.databaes.civilens.persona.repository.PersonaRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class PersonaServiceImpl implements PersonaService {

    private final PersonaRepository personaRepository;

    public PersonaServiceImpl(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    @Override
    public void createPersona(Persona persona) {
        persona.setCreatedAt(Instant.now());
        personaRepository.save(persona);
    }
}
