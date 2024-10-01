using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace PsExcercise;

public class SiteController : AController {

    private IWebHostEnvironment Environment { get; }

    public SiteController(IWebHostEnvironment env) {
        this.Environment = env;
    }

    private string GetFile(string fileName, string fileExtension) {

        Regex rgx = new Regex($@"{fileName}.[a-zA-Z0-9]+.{fileExtension}$");

        foreach(string file in Directory.GetFiles(this.Environment.WebRootPath))
            if(rgx.IsMatch(file))
                return rgx.Match(file).Value;
                
        return null;
    }

    [Route("")]
    [Route("{page}")]
    public IActionResult Index() {
        ViewBag.Bundle = GetFile("bundle", "js");
        ViewBag.NodeModules = GetFile("node_modules", "js");
        return View();
    }
}