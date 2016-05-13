(function ( $ ) {

    /*
      Legacy code to transform an JQuery node into a json object
    */
    $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };

    /*
      Code to check if a string is empty (used on validation)
    */
    String.prototype.isEmpty = function() {
        return (this.length === 0 || !this.trim());
    };

    $.fn.ninjaform = function(options) {
        // Merging default settings with user custom options
        var settings = $.extend({
          'actionURL': 'https://www.rdstation.com.br/api/1.2/conversions',
          'namespace': 'ninjaform',
          'fields': {},
          'modal': false,
          'label': true,
          'wrapper': true,
          'bootstrap': true
        }, options);

        // Generate default fields
        var generateDefaultFields = function(){
          var resultHTML = [];
          var formControl = settings.bootstrap == true ? 'form-control' : '';
          var flashContainer = '<p class="'+ settings.namespace +'-flash"></p>';
          var formOpen = '<form action="' + settings.actionURL +'" class="' + settings.namespace + '-form">';
          var formClose = '</form>';
          var nameInput = '<input class="' + settings.namespace + '-input ' + formControl + '" name="name" type="text">';
          var emailInput = '<input class="' + settings.namespace + '-input ' + formControl + '" name="email" type="email">';
          var submitButton = '<button class="'+ settings.namespace +'-submit" type="submit">Enviar</button>'
          var customFields = [];
          for(key in options['fields']){
            var fieldArray = options['fields'][key];
            var field = '<select class="' + settings.namespace + '-select ' + formControl + '" name="' + key + '">';
            for(insideKey in fieldArray){
              field += '<option class="' + settings.namespace + '-option" value="' + fieldArray[insideKey] +'">' + fieldArray[insideKey] + '</option>';
            }
            field += "</select>";
            customFields.push(field);
          }

          // Create wrappers
          if(settings.wrapper){
            var openWrapper;
            var closeWrapper = '</div>';
            // Use bootstrap classes on the wrappers
            if (settings.bootstrap) {
              openWrapper = '<div class="'+ settings.namespace +'-wrapper form-group">';
            }else{
              openWrapper = '<div class="'+ settings.namespace +'-wrapper">';
            }

            // filling wrappers
            nameInput = openWrapper + nameInput + closeWrapper;
            emailInput = openWrapper + emailInput + closeWrapper;

            for(key in customFields){
              customFields[key] = openWrapper + customFields[key] + closeWrapper;
            }
          }

          // pushing elements into the result array
          resultHTML.push(flashContainer);
          resultHTML.push(formOpen);
          resultHTML.push(nameInput);
          resultHTML.push(emailInput);
          resultHTML.push(customFields.join(''));
          resultHTML.push(submitButton);
          resultHTML.push(formClose);

          // return the result string
          return resultHTML.join('');
        };

        // Handle default HTML generation
        var generateHTML = function(){
          /*
            Get the default fields and return it.
            
            This function was made in case we need to customize the default behavior without changing the modal behavior.
            In that case, concatenate the contents of generateDefaultFields() into the return of this function
            */
            return generateDefaultFields();
          };
        // Handle modal generation (requires bootstrap)
        var generateModal = function(){
          var resultHTML = [];
          var modalOpen = '<div id="'+ settings.namespace + '-modal" class="modal fade"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-body">';
          var modalClose = '</div> </div> </div> </div>';
          var form = generateDefaultFields();

          // pushing elements into the result array
          resultHTML.push(modalOpen);
          resultHTML.push(form);
          resultHTML.push(modalClose);

          // return the result string
          return resultHTML.join('');
        };

        var openModal = function(){
          // TODO open modal
          $('#' + settings.namespace + '-modal').modal();
        };

        var validateForm = function($form){
          var name = $form.find('[name="name"]').val();
          var email = $form.find('[name="email"]').val();
          if(name.isEmpty() || email.isEmpty()) return false;

          return true;
        };

        var initSubmitListener = function(){
          var submitSelector = '.' + settings.namespace + '-submit';
          // Remove listeners to avoid double listening
          $(submitSelector).off('click');
          $(submitSelector).click(function(e){
            e.preventDefault();
            var $closestForm = $(this).closest('form');
            if(validateForm($closestForm)){
              submitForm($closestForm);
            }else{
              var $flashContainer = $closestForm.parent().find('.' + settings.namespace + '-flash');
              $flashContainer.addClass('bg-danger');
              $flashContainer.text('Verifique os erros no formulário');
            }
            
          });
        };

        var submitForm = function($form){
          var leadData = $form.serializeObject();
          var $flashContainer = $form.parent().find('.' + settings.namespace + '-flash');
          var postData = {
            'token_rdstation': settings.token,
            'secret': settings.secret,
            'name': leadData.name,
            'email': leadData.email
            // 'lead': leadData
          };
          // adding custom fields to the post data
          for(key in settings.fields){
            var fieldValue = $form.find('[name="' + key + '"] option:selected').val();
            postData[key] = fieldValue;
          }

          // console.log(postData);
          $.post({
            'url': $form.attr('action'),
            'data': postData,
            'success': function(data){
              $flashContainer.addClass('bg-success');
              $flashContainer.text('Formulário enviado com sucesso');
            },
            'error': function(jqXHR, textStatus, errorThrown){
              $flashContainer.addClass('bg-danger');
              $flashContainer.text('Erro ao enviar formulário');
            }
          });
        };

        // Plugin execution

        if(settings.modal === false){
          // Default behavior
          var result = this.each(function(){
            $(this).html(generateHTML());
          });
          initSubmitListener();
          return result;
        }else{
          // Modal behavior
          var modalHTML = generateModal();
          $('body').append(modalHTML);
          initSubmitListener();
          return this.each(function(){
            $(this).click(function(e){
              e.preventDefault();
              openModal();
            });

          });
        }
        
      };

    }( jQuery ));