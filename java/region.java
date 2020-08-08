package com.opttimusdev.springbootapirest.models.entity;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "regiones")
public class Region implements Serializable {
    public Region(){}
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
//    SI SE EMITE COLUMN VA A MAPIAR DE FORMA AUTOMATICA
    private String nombre;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNombre () {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    private static final long serialVersuionUID = 1L;

}
