namespace Assessment.Application.Exceptions;

public class BusinessException : Exception
{
    public const string CourseWithoutLessonsMessage = "No se puede publicar un curso sin tener una o más lecciones.";
    
    public BusinessException(string message) : base(message) { }
}
