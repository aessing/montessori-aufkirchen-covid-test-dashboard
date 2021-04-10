﻿function getClasses() {
  const contentBody = document.querySelector('.content-body');

  let html = '';
  let rowCount = 0;

  const request = new XMLHttpRequest();
  request.open('POST', '/api/GetTestStatus', true);
  request.send();

  request.addEventListener('load', function () {
    const data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      let statusColor;
      let statusMessage;
      let statusProgress;

      data.forEach((entity) => {
        switch (entity.status) {
          case 0:
            statusColor = 'danger';
            statusMessage = 'Test ausstehend';
            statusProgress = 0;
            break;
          case 1:
            statusColor = 'warning';
            statusMessage = 'Es wird getestet';
            statusProgress = 50;
            break;
          case 2:
            statusColor = 'success';
            statusMessage = 'Test abgeschlossen';
            statusProgress = 100;
            break;
          case 3:
            statusColor = 'info';
            statusMessage = 'Heute kein Test';
            statusProgress = 100;
            break;
        }

        if (rowCount === 0) {
          html += `<div class="row">
        `;
        }

        html += `<div class="col-xl-3 col-lg-6 col-12">
                    <div class="card pull-up">
                      <div class="card-content">
                        <div class="card-body">
                          <div class="media d-flex">
                            <div class="media-body text-left">
                              <h3 class="${statusColor}">${statusMessage}</h3>
                            </div>
                            <div>
                              <p class="${statusColor} font-large-2 float-right" style="font-style: italic">${entity.class}</p>
                            </div>
                          </div>
                          <div class="progress progress-sm mt-1 mb-0 box-shadow-2">
                            <div
                              class="progress-bar bg-gradient-x-${statusColor}"
                              role="progressbar"
                              style="width: ${statusProgress}%"
                              aria-valuenow="${statusProgress}"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                          <div class="pt-2">
                            <button type="button" onclick="setClassStatus('${entity.class}', 3)" class="btn btn-info btn-min-width mr-1 mb-1 waves-effect waves-light">Heute kein Test</button>
                            <button type="button" onclick="setClassStatus('${entity.class}', 0)" class="btn btn-danger btn-min-width mr-1 mb-1 waves-effect waves-light">Test ausstehend</button>
                            <button type="button" onclick="setClassStatus('${entity.class}', 1)" class="btn btn-warning btn-min-width mr-1 mb-1 waves-effect waves-light">Es wird getestet</button>
                            <button type="button" onclick="setClassStatus('${entity.class}', 2)" class="btn btn-success btn-min-width mr-1 mb-1 waves-effect waves-light">Test abgeschlossen</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  `;

        if (rowCount === 3) {
          html += `</div>
        `;
          rowCount = 0;
        } else rowCount++;
      });

      if (rowCount != 0) {
        html += `</div>
      `;
      }
    } else {
      html = error;
    }
    //contentBody.insertAdjacentHTML('beforeend', html);
    contentBody.innerHTML = html;
  });
}

function setClassStatus(className, classStatus) {
  const params = {
    class: className,
    status: classStatus,
  };
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
  };
  fetch('/api/SetTestStatus', options)
    .then((response) => response.json())
    .then((response) => {
      getClasses();
    });
}

function showClasses() {
  getClasses();
}

setInterval(function () {
  showClasses();
}, 120 * 1000);
