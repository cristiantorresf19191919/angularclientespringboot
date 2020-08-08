package com.opttimusdev.springbootapirest.controllers;

import com.opttimusdev.springbootapirest.models.entity.Cliente;
import com.opttimusdev.springbootapirest.models.entity.Region;
import com.opttimusdev.springbootapirest.services.IClienteService;
import com.opttimusdev.springbootapirest.services.IUploadFileService;
import org.apache.coyote.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class ClienteRestController {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private IClienteService iClienteService;

    @Autowired
    private IUploadFileService iUploadFileService;

    // loguear por consola
    Logger logger = LoggerFactory.getLogger(ClienteRestController.class);
    @GetMapping("/generar")
    public String hashear(){
        String password = "12345";
        String passwordBcrypt = " ";
        for (int i = 0; i < 4; i++){
            passwordBcrypt = passwordEncoder.encode(password);
            System.out.println(passwordBcrypt);
        }
        return passwordBcrypt;
    }

    @GetMapping("/clientes")
    public List<Cliente> index() {
        return iClienteService.findAll();
    }

    @GetMapping("/clientes/page/{nopage}")
    public Page<Cliente> index(@PathVariable Integer nopage) {
        Pageable pageable = PageRequest.of(nopage, 4);
        return iClienteService.findAll(pageable);
    }
    //@Secured({"ROLE_ADMIN","ROLE_USER"})
    @GetMapping("/clientes/{id}")
    public ResponseEntity<?> show(@PathVariable Long id) {
        Cliente cliente = null;
        Map<String, Object> response = new HashMap<>();
        try {
            cliente = iClienteService.findById(id);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta de la base de datos");
            response.put("error", Objects.requireNonNull(
                    e.getMessage()).concat(": ")
                    .concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }
        if (cliente == null) {
            response.put(
                    "mensaje", "El cliente ID:"
                            .concat(id.toString().concat("no existe en la base de datos")));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<Cliente>(cliente, HttpStatus.OK);
    }


    //CREAR CLIENTE
    @Secured("ROLE_ADMIN")
    @PostMapping("/clientes")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> create(@Valid @RequestBody Cliente cliente, BindingResult result) {
        Cliente clienteNuevo = null;
        Map<String, Object> response = new HashMap<>();
        if (result.hasErrors()) {
           /* List<String> errors = new ArrayList<>();
           for (FieldError cadaError : result.getFieldErrors()){
               errors.add("El campo "+cadaError.getField()+" ' ' "+cadaError.getDefaultMessage());
           }*/
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "el campo '" + err.getField() + " ' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }
        try {
            clienteNuevo = iClienteService.save(cliente);
        } catch (DataAccessException e) {
            response.put("mensaje", "Error al realizar la consulta en la base de datos");
            response.put("error", Objects.requireNonNull(e.getMessage()).concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        response.put("mensaje", "El cliente ha sido creado con exito");
        response.put("cliente", clienteNuevo);
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @Secured("ROLE_ADMIN")
    @PutMapping("/clientes/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody Cliente cliente, BindingResult result, @PathVariable Long id) {
        Cliente clientActual = iClienteService.findById(id);
        Cliente clienteUpdated = null;
        Map<String, Object> response = new HashMap<>();
        if (clientActual == null) {
            response.put("mensaje", "Error no se pudo editar el cliente con el ID: ".concat(id.toString()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
        }
        if (result.hasErrors()) {
           /* List<String> errors = new ArrayList<>();
           for (FieldError cadaError : result.getFieldErrors()){
               errors.add("El campo "+cadaError.getField()+" ' ' "+cadaError.getDefaultMessage());
           }*/
            List<String> errors = result.getFieldErrors()
                    .stream()
                    .map(err -> "el campo '" + err.getField() + " ' " + err.getDefaultMessage())
                    .collect(Collectors.toList());

            response.put("errors", errors);
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.BAD_REQUEST);
        }
        try {
//            cliente es el objeto cEEEEon todo lo que viene desde el backend
            clientActual.setApellido(cliente.getApellido());
            clientActual.setNombre(cliente.getNombre());
            clientActual.setEmail(cliente.getEmail());
            clientActual.setCreatedAt(cliente.getCreatedAt());
            clientActual.setRegion(cliente.getRegion());
            clienteUpdated = iClienteService.save(clientActual);
            response.put("mensaje", "el ciente ha sido actualizado con exito");
            response.put("cliente", clienteUpdated);
        } catch (DataAccessException e) {
            response.put("message", "error al actualizar al cliente en la base de datos");
            response.put("error", Objects.requireNonNull(e.getMessage()).concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        System.out.println("test");
        Cliente clientePoderoso = null;
        Map<String, Object> response = new HashMap<>();
        try {
            Cliente cliente = iClienteService.findById(id);
            String nombreFotoAnterior = cliente.getFoto();
            Boolean borrado = iUploadFileService.eliminar(nombreFotoAnterior);

            clientePoderoso = iClienteService.findById(id);
            if (clientePoderoso == null) {
                response.put("mensaje", "el cliente no se encuentra en la base de datos");
                return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
            }
            iClienteService.delete(id);
            response.put("mensaje", "cliente eliminado correcamente de la base de datos");
        } catch (DataAccessException e) {
            response.put("mensaje", "server error".concat(Objects.requireNonNull(e.getMessage())).concat(": ").concat(e.getMostSpecificCause().getMessage()));
            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.ACCEPTED);

    }

    //    SUBIR UNA FOTO
    @Secured("ROLE_ADMIN")
    @PostMapping("/clientes/upload")
    public ResponseEntity<?> upload(@RequestParam("archivo") MultipartFile archivo, @RequestParam("id") Long id) throws IOException {
        Map<String, Object> response = new HashMap<>();
//        primero encuentre el cliente por el id que viene desde el frontend
        Cliente cliente = iClienteService.findById(id);
//    si el archivo no es vacio
        if (!archivo.isEmpty()) {
            String nombreArchivo = null;

            try{
                nombreArchivo = iUploadFileService.copiar(archivo, cliente.getId());
            } catch (IOException e){
                response.put("mensaje","error a subir la imagen "+nombreArchivo);
                response.put("error",e.getMessage() + e.getCause().getMessage());
            }
        String nombreFotoAnterior = cliente.getFoto();
            Boolean borrado = iUploadFileService.eliminar(nombreFotoAnterior);
            cliente.setFoto(nombreArchivo);
            iClienteService.save(cliente);
            response.put("cliente", cliente);
            response.put("mensaje", "Has subido correctamente la imagen " + nombreArchivo);
        }
        return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
    }


    //VER FOTO
    @GetMapping("/uploads/img/{nombreFoto:.+}")
    public ResponseEntity<Resource> verFoto(@PathVariable String nombreFoto) {

        Resource recurso = null;
        try{
         recurso = iUploadFileService.cargar(nombreFoto);

        }catch (MalformedURLException e){
            e.printStackTrace();
        }



//        CREA LOS HEADERS
        HttpHeaders cabecera = new HttpHeaders();
//        cabecera en el headers para forzar la descarga de imagen en el navegador
//        AGREGA CONTENT DISPOSITION PARA FORZAR QUE EL NAVEGADOR DESCARGUE EL RECURSO
        cabecera.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename = \" " + recurso.getFilename() + " \"  ");
//      DEVUELVE LA ENTIDAD RESPUESTA DE TIPO RECURSO JUNTO CON LA CABEZERA Y CODIGO 200
        return new ResponseEntity<Resource>(recurso, cabecera, HttpStatus.OK);
    }


    @Secured({"ROLE_ADMIN","ROLE_USER"})
    @GetMapping("/clientes/regiones")
    public List<Region> listarRegiones() {
        return iClienteService.findAllRegiones();
    }
}
